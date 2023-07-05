export const ALIGN_ATTRIBUTE = 'align';

export type Alignment = {
  name: string,
  apply: (el: HTMLElement) => void;
}

const ALIGN_LEFT = 'left';
const ALIGN_CENTER = 'center';
const ALIGN_RIGHT = 'right';
const ALIGN_JUSTIFY = 'justify';

export default class Aligner {
  alignments: { [key: string]: Alignment };
  alignAttribute: string;
  // applyStyle: boolean;

  lastAlign: string = ALIGN_LEFT; 
  preWidth: number = 0;
  preRatio: number = 1;


  constructor() {
    // this.applyStyle = true;
    this.alignAttribute = ALIGN_ATTRIBUTE;
    this.alignments = {
      [ALIGN_LEFT]: {
        name: ALIGN_LEFT,
        apply: (element: HTMLElement) => {
          this.setAlignment(element, ALIGN_LEFT);
          this.setStyle(element, 'inline', 'left', '0 1em 1em 0');
        },
      },
      [ALIGN_CENTER]: {
        name: ALIGN_CENTER,
        apply: (element: HTMLElement) => {
          this.setAlignment(element, ALIGN_CENTER);
          this.setStyle(element, 'block', 'block', 'auto');
        },
      },
      [ALIGN_JUSTIFY]: {
        name: ALIGN_JUSTIFY,
        apply: (element: HTMLElement) => {
          this.setAlignment(element, ALIGN_JUSTIFY);
          this.setStyle(element, 'block', 'block', 'auto', true);
        },
      },
      [ALIGN_RIGHT]: {
        name: ALIGN_RIGHT,
        apply: (element: HTMLElement) => {
          this.setAlignment(element, ALIGN_RIGHT);
          this.setStyle(element, 'inline', 'right', '0 0 1em 1em');
        },
      },
    };
  }

  // getAlignments(): Alignment[] {
  //   return Object.keys(this.alignments).map(k => this.alignments[k]);
  // }

  // clear(el: HTMLElement): void {
  //   el.removeAttribute(this.alignAttribute);
  //   this.setStyle(el, null, null, null);
  // }

  // isAligned(el: HTMLElement, alignment: Alignment): boolean {
  //   return el.getAttribute(this.alignAttribute) === alignment.name;
  // }

  setAlignment(element: HTMLElement, align: string) {
    if(this.lastAlign == ALIGN_JUSTIFY && align != this.lastAlign){
      this.setSize(element,`${this.preWidth}px`)
    }
    this.lastAlign = align;
    element.setAttribute(this.alignAttribute, align);
  }

  setSize(element: HTMLElement, width: string){
    let rect = element.getBoundingClientRect();
    this.preWidth = rect.width;
    this.preRatio = rect.height / rect.width;

    element.setAttribute('width', width);
    rect = element.getBoundingClientRect();
    element.setAttribute('height', `${rect.width * this.preRatio}px`);
  }

  setStyle(element: HTMLElement, display: string, float: string, margin: string, justify?: boolean) {
    //if (this.alignments) {
    element.style.setProperty('display', display);
    element.style.setProperty('float', float);
    element.style.setProperty('margin', margin);
    if (justify) {
       this.setSize(element,'100%');
    }
    //}
  }
}
