declare class Toolbar {
    container: HTMLElement;
    controls: Array<[string, HTMLElement]>;
    handlers: { [key: string]: any };
    options: {};
    quill: any;
    addHandler(format: string, handler: any): void;
    attach(input: HTMLElement): void;
    update(range: number | null | any): void;
    addButton(container: HTMLElement, format: string, value: any): void;
    addControls(container: HTMLElement, groups: []): void;
    addSelect(container: HTMLElement, format: string, values: []): void;
 }

export default Toolbar; 