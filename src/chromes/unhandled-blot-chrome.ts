import ResizeModule from "../quill-blot-resizer";
import BlotChrome from "./blot-chrome";


const MOUSE_ENTER_ATTRIBUTE = 'data-blot-chromes-unhandled-bound';
const PROXY_IMAGE_CLASS = 'blot-chromes__proxy-image';

export default class UnhandledBlotChrome extends BlotChrome {
  selector: string;
  unhandled: HTMLElement | null;
  nextUnhandled: HTMLElement | null;
  proxyImage: HTMLImageElement | undefined;

  constructor(chromes: ResizeModule, selector: string) {
    super(chromes);
    this.selector = selector;
    this.unhandled = null;
    this.nextUnhandled = null;
  }

  init() {
    if (document.body) {
      /*
      it's important that this is attached to the body instead of the root quill element.
      this prevents the click event from overlapping with ImageSpec
       */
      document.body.appendChild(this.createProxyImage());
    }

    this.hideProxyImage();
    this.proxyImage?.addEventListener('click', this.onProxyImageClick);
    this.quill.on('text-change', this.onTextChange);
  }

  getTargetElement(): HTMLElement {
    return this.unhandled?? HTMLElement.prototype;
  }

  getOverlayElement(): HTMLElement {
    return this.unhandled?? HTMLElement.prototype;
  }

  onHide() {
    this.hideProxyImage();
    this.nextUnhandled = null;
    this.unhandled = null;
  }

  createProxyImage(): HTMLElement {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if(!!context){
      context.globalAlpha = 0;
      context.fillRect(0, 0, 1, 1);  
    }
    
    this.proxyImage = document.createElement('img');
    this.proxyImage.src = canvas.toDataURL('image/png');
    this.proxyImage.classList.add(PROXY_IMAGE_CLASS);

    Object.assign(this.proxyImage.style, {
      position: 'absolute',
      margin: '0',
    });

    return this.proxyImage;
  }

  hideProxyImage() {
    if (!this.proxyImage) return;
      Object.assign(this.proxyImage.style, {
        display: 'none',
      });
  }

  repositionProxyImage(unhandled: HTMLElement) {
    const rect = unhandled.getBoundingClientRect();
    if (!this.proxyImage) return;
    Object.assign(
      this.proxyImage.style,
      {
        display: 'block',
        left: `${rect.left + window.pageXOffset}px`,
        top: `${rect.top + window.pageYOffset}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      },
    );
  }

  onTextChange = () => {
    Array.from(document.querySelectorAll(`${this.selector}:not([${MOUSE_ENTER_ATTRIBUTE}])`))
      .forEach((unhandled) => {
        unhandled.setAttribute(MOUSE_ENTER_ATTRIBUTE, 'true');
        unhandled.addEventListener('mouseenter', this.onMouseEnter as (ev: Event)=>void);
      });
  };

  onMouseEnter = (event: MouseEvent) => {
    const element = event.target;
    if (!(element instanceof HTMLElement)) {
      return;
    }

    this.nextUnhandled = element;
    this.repositionProxyImage(this.nextUnhandled);
  }

  onProxyImageClick = () => {
    this.unhandled = this.nextUnhandled;
    this.nextUnhandled = null;
    this.chromes.show(this);
    this.hideProxyImage();
  };
}
