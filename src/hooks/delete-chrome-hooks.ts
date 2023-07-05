import ResizeModule from "../quill-blot-resizer";
import ChromeHooks from './chrome-hooks';

export default class DeleteChromeHooks extends ChromeHooks {

  constructor(chromes: ResizeModule) {
    super(chromes);
  }
  onCreate() {
    document.addEventListener('keyup', this.onKeyUp, true);
    this.quill.root.addEventListener('input', this.onKeyUp as (ev: Event)=>void, true);
  }

  onDestroy() {
    document.removeEventListener('keyup', this.onKeyUp);
    this.quill.root.removeEventListener('input', this.onKeyUp as (ev: Event)=>void);
  }

  onKeyUp = (e: KeyboardEvent) => {
    if (!this.chromes.currentChrome) {
      return;
    }

    if (e.code === 'Delete' || e.code === 'Backspace' || e.keyCode === 46 || e.keyCode === 8) {
      // const blot = this.quill.statics.find(this.chromes.currentChrome.getTargetElement());
      // if (blot) {
      //   blot.deleteAt(0);
      // }
      // this.chromes.hide();
    }
  };
}
