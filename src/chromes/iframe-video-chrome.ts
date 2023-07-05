import ResizeModule from "../quill-blot-resizer";
import UnhandledBlotChrome from "./unhandled-blot-chrome";

export default class IframeVideoChrome extends UnhandledBlotChrome {
  constructor(chromes: ResizeModule) {
    super(chromes, 'iframe.ql-video');
  }
}
