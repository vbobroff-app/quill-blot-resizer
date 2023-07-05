import Quill from 'quill';
import ResizeModule from '../quill-blot-resizer';
import AlignChromeHooks from '../hooks/align-chrome-hooks';
import ChromeHooks from '../hooks/chrome-hooks';
import DeleteChromeHooks from '../hooks/delete-chrome-hooks';
import ResizeChromeHooks from '../hooks/resize-chrome-hooks';

export default abstract class BlotChrome {
  chromes: ResizeModule;
  quill: Quill;

  constructor(chromes: ResizeModule) {
    this.chromes = chromes;
    this.quill = chromes.quill;
  }

  init(): void {}

  getActions(): typeof ChromeHooks[] {
    return [AlignChromeHooks, ResizeChromeHooks, DeleteChromeHooks];
  }

  getTargetElement(): HTMLElement {
    return HTMLElement.prototype;
  }

  getOverlayElement(): HTMLElement {
    return this.getTargetElement();
  }

  setSelection(): void { }

  onHide() {}
}
