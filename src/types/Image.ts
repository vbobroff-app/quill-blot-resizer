declare class ImageBlot {

    domNode: HTMLElement;
  
    static create(value: any): Element;
    static formats(domNode: Element): {};
    static match(url: string): boolean;
    static register(): void;
    static sanitize(url: string): string;
    static value(domNode: Element): string | null;
  
    format(name: any, value: any): void;
  
    static blotName: string;
    static tagName: string; 
  }
  
export default ImageBlot;  