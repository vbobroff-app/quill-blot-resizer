import ResizeModule from "../quill-blot-resizer";
import Quill from '@typing/quill';

export default abstract class ChromeHooks {
  chromes: ResizeModule;
  quill: Quill;

  constructor(chromes: ResizeModule) {
    this.chromes = chromes;
    this.quill = chromes.quill;
  }

  onCreate() {}

  onDestroy() {}

  onUpdate() {}

}
