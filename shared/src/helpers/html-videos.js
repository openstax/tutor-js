import _ from 'underscore';

const getRatioClass = function(frame) {
    if (!frame.width || !frame.height) {
        return 'embed-responsive-16by9';
    }

    const ratio = frame.width / frame.height;
    if (Math.abs(ratio - (16 / 9)) > Math.abs(ratio - (4 / 3))) {
        return 'embed-responsive-4by3';
    } else {
        return 'embed-responsive-16by9';
    }
};

const isEmbedded = frame => frame.parentNode != null ? frame.parentNode.classList.contains('embed-responsive') : undefined;

const isInteractive = frame => frame.classList.contains('interactive');

const wrapFrames = function(dom, shouldExcludeFrame) {
    _.each(dom.getElementsByTagName('iframe'), function(frame) {
        if (isEmbedded(frame) || isInteractive(frame) || (typeof shouldExcludeFrame === 'function' ? shouldExcludeFrame(frame) : undefined)) { return null; }

        const wrapper = document.createElement('div');
        wrapper.className = `frame-wrapper embed-responsive ${getRatioClass(frame)}`;
        frame.parentNode.replaceChild(wrapper, frame);
        return wrapper.appendChild(frame);
    });

    return dom;
};

export { wrapFrames, getRatioClass };
