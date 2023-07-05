import ResizeModule from "../quill-blot-resizer";
import BlotChrome from "./blot-chrome";


export default class ImageChrome extends BlotChrome {
  img: HTMLImageElement | null;
  chromes: ResizeModule;

  constructor(chromes: ResizeModule) {
    super(chromes);
    this.img = null;
    this.chromes = chromes;
  }

  init() {
    this.quill.root.addEventListener('click', this.onClick);
  }

  getTargetElement(): HTMLElement {
    return this.img?? HTMLElement.prototype;
  }

  onHide() {
    this.img = null;
  }

  onClick = (event: MouseEvent) => {
    const element = event.target;
    if (!(element instanceof HTMLImageElement) || element.tagName !== 'IMG') {
      return;
    }
    this.img = element;
    this.chromes.show(this);
  };
}
