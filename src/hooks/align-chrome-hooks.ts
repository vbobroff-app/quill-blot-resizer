import ResizeModule from '../quill-blot-resizer';
import Aligner from '../aligner';
import ChromeHooks from './chrome-hooks';
import Toolbar from '../types/toolbar'

export type QuillAlign = 'false' | 'right' | 'center' | 'justify';

export default class AlignChromeHooks extends ChromeHooks {
  aligner: Aligner;
  target: HTMLElement | undefined;
  toolbar: Toolbar | undefined;
  alignHandler: (value: any)=> void = ()=>{};

  constructor(chromes: ResizeModule) {
    super(chromes);;
    this.aligner = new Aligner();
    this.target = this.chromes?.currentChrome?.getTargetElement();
  }

  onCreate() {
     this.toolbar = this.quill.getModule('toolbar');
     this.alignHandler = this.toolbar?.handlers['align'];
     this.toolbar?.addHandler('align', (value: QuillAlign)=>{
      this.setAlignment(value)
    });     
  }

  onDestroy() {
    this.toolbar?.addHandler('align', this.alignHandler);

  }

  setAlignment(quillAlign: QuillAlign){
    const align = quillAlign? quillAlign : 'left';
    if (!!this.target){
      this.aligner.alignments[align].apply(this.target)
    }
  }

}
