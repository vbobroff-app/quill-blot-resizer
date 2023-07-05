import { ALIGN_ATTRIBUTE } from "../aligner";
import ResizeModule from "../quill-blot-resizer";
import { GripOptions, GripPosition } from "../chromes-options";
import ChromeHooks from "./chrome-hooks";

export const POSITION_ATTRIBUTE = 'chrome-position';

export default class ResizeChromeHooks extends ChromeHooks {
  topLeftGrip: HTMLElement;
  topRightGrip: HTMLElement;
  bottomRightGrip: HTMLElement;
  bottomLeftGrip: HTMLElement;

  topGrip: HTMLElement;
  rightGrip: HTMLElement;
  bottomGrip: HTMLElement;
  leftGrip: HTMLElement;

  dragGrip: HTMLElement | null;
  dragStartX: number;
  dragStartY: number;
  preDragWidth: number;
  preDragHeight: number;
  targetRatio: number;

  observer: MutationObserver | undefined;

  disabled: boolean = false;
  //topEnabled: boolean;
  gripOptions: GripOptions | undefined;

  constructor(chromes: ResizeModule) {
    super(chromes);

    const options = chromes?.currentOptions;
    this.gripOptions = options?.grips;

    if (chromes.overlay) {
      chromes.overlay.className = options?.overlay.className?? '';
      if (options?.overlay.style) {
        Object.assign(chromes.overlay.style, options.overlay.style);
      }
    }

    this.topLeftGrip = this.createGrip('top-left');
    this.topRightGrip = this.createGrip('top-right');
    this.bottomRightGrip = this.createGrip('bottom-right');
    this.bottomLeftGrip = this.createGrip('bottom-left');

    this.topGrip = this.createGrip('top');
    this.rightGrip = this.createGrip('right');
    this.bottomGrip = this.createGrip('bottom');
    this.leftGrip = this.createGrip('left');

    this.dragGrip = null;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.preDragWidth = 0;
    this.preDragHeight = 0;
    this.targetRatio = 0;

  }

  onCreate() {
    this.chromes.overlay.appendChild(this.topLeftGrip);
    this.chromes.overlay.appendChild(this.topRightGrip);
    this.chromes.overlay.appendChild(this.bottomRightGrip);
    this.chromes.overlay.appendChild(this.bottomLeftGrip);

    this.chromes.overlay.appendChild(this.topGrip);
    this.chromes.overlay.appendChild(this.leftGrip);
    this.chromes.overlay.appendChild(this.bottomGrip);
    this.chromes.overlay.appendChild(this.rightGrip);

    this.repositionHandles(this.gripOptions?.style?? {});

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type == "attributes" && mutation.attributeName == ALIGN_ATTRIBUTE) {
          this.chromes.repositionOverlay();
          const align: string | null | undefined = this.chromes.currentChrome?.getTargetElement()?.getAttribute(ALIGN_ATTRIBUTE);
          if (align != 'justify' && this.disabled) {
            this.enableAll();
          }
          // else if (this.topEnabled) {
          //   this.enableGrip(this.topGrip);
          // }
          switch (align) {
            case 'right':
              this.disableGrip(this.rightGrip);
              this.enableGrip(this.bottomGrip);
              this.enableGrip(this.leftGrip);
              break;
            case 'left':
              this.enableGrip(this.rightGrip);
              this.enableGrip(this.bottomGrip);
              this.disableGrip(this.leftGrip);
              break;
            case 'center':
              this.enableGrip(this.rightGrip);
              this.enableGrip(this.bottomGrip);
              this.enableGrip(this.leftGrip);
              break;
            default:
              this.disableAll();
              this.enableGrip(this.bottomGrip);
          }
        }
      });
    });
    const element = this.chromes?.currentChrome?.getTargetElement();
    if (!!element){
      this.observer.observe(element, { attributes: true });
    }    
  }

  onDestroy() {
    this.setCursor('auto');
    this.chromes.overlay.removeChild(this.topLeftGrip);
    this.chromes.overlay.removeChild(this.topRightGrip);
    this.chromes.overlay.removeChild(this.bottomRightGrip);
    this.chromes.overlay.removeChild(this.bottomLeftGrip);

    this.chromes.overlay.removeChild(this.topGrip);
    this.chromes.overlay.removeChild(this.leftGrip);
    this.chromes.overlay.removeChild(this.bottomGrip);
    this.chromes.overlay.removeChild(this.rightGrip);

    this.observer?.disconnect();
  }

  createGrip(position: string): HTMLElement {
    let grip = document.createElement('div');
    const className = this.gripOptions?.className;
    if(!!className){
      grip.classList.add(className);
    }
    
    grip.setAttribute(POSITION_ATTRIBUTE, position);

    if (!!this.gripOptions?.style) {
      Object.assign(grip.style, this.gripOptions.style);
    }
    this.enableGrip(grip);

    grip.addEventListener('mouseout', () => {
      if (grip != this.dragGrip) {
        grip.style.background = 'white'
      }
    });

    grip.addEventListener('mouseover', () => {
      if (grip.getAttribute('handled') == 'disable') {
        return;
      }
      if (!this.dragGrip || grip == this.dragGrip) {
        grip.style.background = '#0d84fcb0'
      }
    });

    return grip;
  }

  repositionHandles(optionsStyle: { [key: string]: any }) {
    let handleXOffset = '0px';
    let handleYOffset = '0px';
    if (optionsStyle) {
      if (optionsStyle.width) {
        handleXOffset = `${-parseFloat(optionsStyle.width) / 2 - 1}px`;
      }
      if (optionsStyle.height) {
        handleYOffset = `${-parseFloat(optionsStyle.height) / 2 - 1}px`;
      }
    }

    Object.assign(this.topLeftGrip.style, { left: handleXOffset, top: handleYOffset });
    Object.assign(this.topRightGrip.style, { right: handleXOffset, top: handleYOffset });
    Object.assign(this.bottomRightGrip.style, { right: handleXOffset, bottom: handleYOffset });
    Object.assign(this.bottomLeftGrip.style, { left: handleXOffset, bottom: handleYOffset });

    Object.assign(this.topGrip.style, { left: '50%', 'margin-left': handleXOffset, top: handleYOffset });
    // if (!this.topEnabled) {
    //   this.disableGrip(this.topGrip);
    // }
    Object.assign(this.leftGrip.style, { left: handleXOffset, top: '50%', 'margin-top': handleYOffset });
    this.disableGrip(this.leftGrip);
    Object.assign(this.rightGrip.style, { right: handleXOffset, top: '50%', 'margin-top': handleYOffset });
    Object.assign(this.bottomGrip.style, { left: '50%', 'margin-left': handleXOffset, bottom: handleYOffset });

  }

  checkEnableGrip(grip: HTMLElement): boolean {
    const position = grip.getAttribute(POSITION_ATTRIBUTE) as unknown as GripPosition;
    if (this.gripOptions?.enabled?.includes('all')) {
      return true;
    }
    const direct = !this.gripOptions?.enabled.includes('over');
    return direct && this.gripOptions?.enabled.includes(position) || !direct && !this.gripOptions?.enabled.includes(position);
  }

  enableGrip(grip: HTMLElement) {
    if (!grip) {
      return;
    }
    if (!this.checkEnableGrip(grip)) {
      return;
    }
    grip.setAttribute('handled', 'enable')
    grip.addEventListener('mousedown', this.onMouseDown);
    Object.assign(grip.style, { border: '1px solid  #0d84fc', cursor: this.getCursor(grip) });
  }

  disableGrip(grip: HTMLElement) {
    if (!grip) {
      return;
    }
    if (!this.checkEnableGrip(grip)) {
      return;
    }
    grip.setAttribute('handled', 'disable')
    grip.removeEventListener('mousedown', this.onMouseDown);
    Object.assign(grip.style, { border: '1px solid rgb(156 156 156)', cursor: null });
  }

  enableAll() {
    this.enableGrip(this.topLeftGrip);
    this.enableGrip(this.topRightGrip);
    this.enableGrip(this.bottomRightGrip);
    this.enableGrip(this.bottomLeftGrip);

    this.enableGrip(this.topGrip);
    this.enableGrip(this.leftGrip);
    this.enableGrip(this.bottomGrip);
    this.enableGrip(this.rightGrip);

    this.disabled = false;
  }

  disableAll() {
    this.disableGrip(this.leftGrip);
    this.disableGrip(this.bottomGrip);
    this.disableGrip(this.rightGrip);

    this.disableGrip(this.topLeftGrip);
    this.disableGrip(this.topRightGrip);
    this.disableGrip(this.bottomRightGrip);
    this.disableGrip(this.bottomLeftGrip);

    this.disabled = true;
  }

  getCursor(grip: HTMLElement): string {
    const position = grip.getAttribute(POSITION_ATTRIBUTE);
    switch (position) {
      case 'top': return 'ns-resize';
      case 'right': return 'ew-resize';
      case 'bottom': return 'ns-resize';
      case 'left': return 'ew-resize';
      case 'top-left': return 'nwse-resize';
      case 'top-right': return 'nesw-resize';
      case 'bottom-right': return 'nwse-resize';
      case 'bottom-left': return 'nesw-resize';
      default: return 'auto';
    }
  }

  setCursor(value: string) {
    if (document.body) {
      document.body.style.cursor = value;
    }
    if (this.chromes.currentChrome) {
      const target = this.chromes.currentChrome.getOverlayElement();
      if (target) {
        target.style.cursor = value;
      }
    }
  }

  onMouseDown = (event: MouseEvent) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }
    this.dragGrip = event.target;
    this.setCursor(this.dragGrip.style.cursor);

    if (!this.chromes.currentChrome) {
      return;
    }

    const target = this.chromes.currentChrome.getTargetElement();
    if (!target) {
      return;
    }

    const rect = target.getBoundingClientRect();

    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.preDragWidth = rect.width;
    this.preDragHeight = rect.height;
    this.targetRatio = rect.height / rect.width;

    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.onMouseUp);

  };

  onDrag = (event: MouseEvent) => {
    if (!this.chromes.currentChrome) {
      return;
    }

    const target = this.chromes.currentChrome.getTargetElement();
    if (!target) {
      return;
    }

    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;
    let newWidth = this.preDragWidth;
    let newHeight = this.targetRatio * this.preDragWidth;

    if (this.dragGrip === this.topLeftGrip || this.dragGrip === this.bottomLeftGrip || this.dragGrip == this.leftGrip) {
      newWidth = Math.round(this.preDragWidth - deltaX);
    } else if (this.dragGrip === this.topRightGrip || this.dragGrip === this.bottomRightGrip || this.dragGrip == this.rightGrip) {
      newWidth = Math.round(this.preDragWidth + deltaX);
    }

    if (this.dragGrip != this.rightGrip && this.dragGrip != this.leftGrip) {

      if (this.dragGrip == this.bottomGrip) {
        newHeight = Math.round(this.preDragHeight + deltaY);
      } else if (this.dragGrip == this.topGrip) {
        newHeight = Math.round(this.preDragHeight - deltaY);
      } else {
        newHeight = this.targetRatio * newWidth;
      }
    }

    target.setAttribute('width', `${newWidth}px`);
    target.setAttribute('height', `${newHeight}px`);

    Object.assign(target.style, { width: `${newWidth}px` });

    this.chromes.update();
  };

  onMouseUp = () => {
    this.setCursor('auto');
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.onMouseUp);
    if (this.dragGrip) {
      this.dragGrip.style.background = 'white';
      this.dragGrip = null;
    }

  };
}
