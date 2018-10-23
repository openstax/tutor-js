import _ from 'underscore';

const SUPPORTED = typeof document.queryCommandSupported === 'function' ? document.queryCommandSupported('copy') : undefined;

export default {
  isSupported: _.constant(!!SUPPORTED),

  copy() {
    if (!SUPPORTED) { return; }

    try {
      return document.execCommand('copy');
    } catch (e) {
      return console.warn('clipboard copy failed', e);
    }
  },
};
