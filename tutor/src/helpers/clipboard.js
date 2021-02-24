import _ from 'underscore';

const SUPPORTED = typeof document.queryCommandSupported === 'function' ? document.queryCommandSupported('copy') : undefined;

export default {
    isSupported: _.constant(!!SUPPORTED),

    copy() {
        if (!SUPPORTED) { return; }

        try {
            document.execCommand('copy');
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('clipboard copy failed', e);
        }
    },
};
