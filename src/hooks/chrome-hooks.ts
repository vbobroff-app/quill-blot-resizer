import Quill from "quill";
import ResizeModule from "../quill-blot-resizer";


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
