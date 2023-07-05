import ResizeModule from "../quill-blot-resizer";
import AlignChromeHooks from "../hooks/align-chrome-hooks";
import ChromeHooks from "../hooks/chrome-hooks";
import DeleteChromeHooks from "../hooks/delete-chrome-hooks";
import ResizeChromeHooks from "../hooks/resize-chrome-hooks";
import TableChromeHooks from "../hooks/table-chrome-hooks";
import BlotChrome from "./blot-chrome";


export default class TableChrome extends BlotChrome {
  table: HTMLElement | null;
  chromes: ResizeModule;

  overHooks: typeof ChromeHooks[]  = [];// [AlignChromeHooks, TableChromeHooks];
  ctrlHooks: typeof ChromeHooks[]  =  [AlignChromeHooks, TableChromeHooks, ResizeChromeHooks, DeleteChromeHooks];

  currentHooks: typeof ChromeHooks[] = [];

  constructor(chromes: ResizeModule) {
    super(chromes);
    this.table = null;
    this.chromes = chromes;
  }

  getActions(): typeof ChromeHooks[] {
    return this.currentHooks;
  }

  init() {
    this.quill.root.addEventListener('click', this.onClick);
  }

  getTargetElement(): HTMLElement {
    return this.table?? HTMLElement.prototype;
  }

  onHide() {
    this.table = null;
  }

  onClick = (event: MouseEvent) => {
    const element = event.target;
    if (!(element instanceof HTMLElement) || element.tagName !== 'TD') {
      return;
    }
    this.currentHooks = event.ctrlKey? this.ctrlHooks: this.overHooks;
    if(!this.currentHooks.length){
        return;
    }
    this.table = element.closest('table');
    this.chromes.show(this);
  };
}
