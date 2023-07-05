import { EmbedBlot } from 'parchment';
import Quill from 'quill';

 declare class Image extends EmbedBlot {

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

 declare class Toolbar {
    container: HTMLElement;
    controls: Array<[string, HTMLElement]>;
    handlers: { [key: string]: any };
    options: {};
    quill: Quill;
    addHandler(format: string, handler: any): void;
    attach(input: HTMLElement): void;
    update(range: number | null | any): void;
    addButton(container: HTMLElement, format: string, value: any): void;
    addControls(container: HTMLElement, groups: []): void;
    addSelect(container: HTMLElement, format: string, values: []): void;
 }
 

export  { Image as default, Toolbar } ;