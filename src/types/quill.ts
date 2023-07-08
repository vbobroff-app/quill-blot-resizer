declare class Quill{
    root: HTMLDivElement;
    static import<T>(pathName: string): T;
    static register(path: string | any, target?: any, overwrite?: any): void;
    getModule<T>(name: string): T;
    on(eventName: string, handler: any): any;   
  }
export default Quill;