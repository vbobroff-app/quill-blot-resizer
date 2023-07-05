export type QuillChromesOptions = {
  chromes: { [key: string]: ChromeOptions },
}

export type ChromeOptions = {
  resize: boolean,
  align: boolean,
  inline: boolean,
  overlay: ChromesOverlayOptions,
  grips: GripOptions
}

export type HotKey = 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey';
export type ChromesOverlayOptions = {
  className: string,
  hotKeys: HotKey[],
  style: {},
}

export type GripPosition = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'all' | 'over';
export type GripOptions = {
  className: string,
  enabled: GripPosition[],
  style: {}
}
