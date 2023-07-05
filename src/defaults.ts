import { ChromeOptions, ChromesOverlayOptions, GripOptions, QuillChromesOptions } from "./chromes-options";

const defaultColor = '#0d84fc';

const defaultOverlay: ChromesOverlayOptions = {
  className: 'chrome__overlay',
  hotKeys: ['ctrlKey'],
  style: {
    position: 'absolute',
    border: `1px solid  ${defaultColor}`,
  },
}

const defaultGripOptions: GripOptions = {
  className: 'chromes__resize-grip',
  enabled: ['all'],
  style: {
    position: 'absolute',
    height: '12px',
    width: '12px',
    color: defaultColor,
    backgroundColor: 'white',
    boxSizing: 'border-box',
    opacity: '0.80',
    border: '1px solid',
    'border-radius': '6px',
  },
}

const defaultChrome: ChromeOptions = {
  resize: true,
  align: true,
  inline: true,
  overlay: defaultOverlay,
  grips: defaultGripOptions
}

const DEFAULT_OPTIONS: QuillChromesOptions = {
  chromes: {
    image: {
      ...defaultChrome,
      overlay: {
        ...defaultOverlay,
        className: 'image_chrome__overlay',
      },
    },
    video: {
      ...defaultChrome,
      overlay: {
        ...defaultOverlay,
        className: 'video_chrome__overlay',
      },
    },
    table: {
      ...defaultChrome,
      inline: false,
      overlay: {
        ...defaultOverlay,
        className: 'table_chrome__overlay',
      },
      grips: {
        ...defaultGripOptions,
        enabled: ['over', 'top'],
      }
    }
  }
};

export default DEFAULT_OPTIONS;
