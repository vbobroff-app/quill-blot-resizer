import Quill from "quill";
import ChromeHooks from "./hooks/chrome-hooks";
import { ChromeOptions, QuillChromesOptions } from "./chromes-options";
import BlotChrome from "./chromes/blot-chrome";
import DEFAULT_OPTIONS from "./defaults";
import Image from "./custom";
import ImageChrome from "./chromes/image-chrome";
import IframeVideoChrome from "./chromes/iframe-video-chrome";
import TableChrome from "./chromes/table-chrome";
import { classOf } from "./utils";

const ImageAttributes = [
  'alt',
  'height',
  'width',
  'style',
  'align'
];

const chromeKeys: Map<string, typeof BlotChrome> = new Map<string, typeof BlotChrome>([
  ['image', ImageChrome],
  ['video', IframeVideoChrome],
  ['table', TableChrome],
]);

class Module {
  quill: Quill;
  options: QuillChromesOptions;
  static DEFAULTS: any;
  constructor(quill: Quill, options: QuillChromesOptions) {
    this.quill = quill;
    this.options = Object.assign(DEFAULT_OPTIONS, options);
  }
}
const ondragstart = document.ondragstart;

export default class ResizeModule extends Module {
  currentChrome: BlotChrome | null;
  currentOptions: ChromeOptions | undefined;
  chromes: BlotChrome[];
  overlay: HTMLElement;
  hooks: ChromeHooks[];
  quillRoot: HTMLElement;
  quillRootContainer: HTMLElement;

  private readonly chromeOption: Map<typeof BlotChrome, ChromeOptions> = new Map<typeof BlotChrome, ChromeOptions>();

  constructor(quill: Quill, options: QuillChromesOptions) {
    super(quill, options);

    this.registerImage(classOf(quill));

    this.quillRoot = this.quill.root;
    this.quillRootContainer = this.quillRoot.parentNode as HTMLElement;

    this.currentChrome = null;
    this.hooks = [];
    this.overlay = document.createElement('div');

    // disable native image resizing on firefox
    document.execCommand('enableObjectResizing', false, 'false'); 
    this.quillRootContainer.style.position = this.quillRootContainer.style.position || 'relative';

    this.quill.root.addEventListener('click', this.onClick);
    const optionsChromesKeys = Object.keys(this.options.chromes);
    const optionsChromesValues = Object.values(this.options.chromes);
    optionsChromesKeys.map((key:string, ind: number)=> {
      const Chrome = chromeKeys.get(key);
      if(!!Chrome){
        this.chromeOption.set(Chrome, optionsChromesValues[ind]);
      }
      
    });
    this.chromes = optionsChromesKeys.map((key: string) => {
      const Chrome = chromeKeys.get(key) as any;
      return new Chrome(this);
    });  
    this.chromes.forEach(chrome => chrome.init());
  }

  typeOf=classOf<Quill>;

  registerImage(quill: typeof Quill) {

    const QuillImage: typeof Image = quill.import('formats/image');

    class StyledImage extends QuillImage {
      static formats(domNode: Element) {
        return ImageAttributes.reduce(function (formats: {[key: string]: string }, attribute: string) {
          if (domNode.hasAttribute(attribute)) {
            formats[attribute] = domNode.getAttribute(attribute)?? '';
          }
          return formats;
        }, {});
      }
      format(name: string, value: string) {
        if (ImageAttributes.indexOf(name) > -1) {
          if (value) {
            this.domNode.setAttribute(name, value);
          } else {
            this.domNode.removeAttribute(name);
          }
        } else {
          super.format(name, value);
        }
      }
    }
    quill.register(StyledImage, true);
  }

  show(chrome: BlotChrome) {
    this.currentChrome = chrome;
    this.currentOptions = this.chromeOption.get(classOf(chrome));
    this.currentChrome.setSelection();
    this.setUserSelect('none');
    this.quillRootContainer.appendChild(this.overlay);
    this.repositionOverlay();
    this.createActions(chrome);
  }

  hide() {
    if (!this.currentChrome) {
      return;
    }

    this.currentChrome.onHide();
    this.currentChrome = null;
    this.quillRootContainer.removeChild(this.overlay);
    this.overlay.style.setProperty('display', 'none');
    this.setUserSelect('');
    this.destroyActions();
  }

  update() {
    this.repositionOverlay();
    this.hooks.forEach(action => action.onUpdate());
  }

  createActions(chrome: BlotChrome) {
    this.hooks = chrome.getActions().map((Hook: any) => {    

      const hook =  new Hook (this) ;
      hook.onCreate();
      return hook as ChromeHooks ;
    });

    document.addEventListener('dragstart', (event) => {
      event.preventDefault();
      document.body.style.cursor = 'auto';
      return false;
    });
  }

  destroyActions() {
    this.hooks.forEach((hooks: ChromeHooks) => hooks.onDestroy());
    this.hooks = [];
    document.ondragstart = ondragstart;
  }

  repositionOverlay() {
    if (!this.currentChrome) {
      return;
    }

    const overlayTarget = this.currentChrome.getOverlayElement();
    if (!overlayTarget) {
      return;
    }

    const parent: HTMLElement = this.quillRootContainer;
    const specRect = overlayTarget.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      display: 'block',
      'margin-left': `${specRect.left - parentRect.left - 1 + parent.scrollLeft}px`,
      top: `${specRect.top - parentRect.top + parent.scrollTop}px`,
      width: `${specRect.width}px`,
      height: `${specRect.height}px`,
    });
  }

  setUserSelect(value: string) {
    const props: string[] = [
      'userSelect',
      'mozUserSelect',
      'webkitUserSelect',
      'msUserSelect',
    ];

    props.forEach((prop: string) => {
      this.quill.root.style.setProperty(prop, value);
      if (document.documentElement) {
        document.documentElement.style.setProperty(prop, value);
      }
    });
  }

  onClick = () => {
    this.hide();
  }
}

ResizeModule.DEFAULTS = DEFAULT_OPTIONS;