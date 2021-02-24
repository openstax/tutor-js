import { get, extend, isEmpty, delay, result, omit } from 'lodash';
import imagesComplete from './images-complete';

// Note that the GetPositionMixin methods are called directly rather than mixing it in
// since we're a mixin ourselves our consumers also include GetPosition and it causes
// duplicate method name errors to mix it in
import { GetPositionMixin } from 'shared';

const DEFAULT_DURATION   = 750; // milliseconds
// This is calculated to be enough for the targeted element to fit under the top navbar
// The navbar's height is controlled by the less variable @tutor-navbar-height from global/navbar.less
const DEFAULT_TOP_OFFSET = 80; // pixels

// Attempt to scroll to element no more than this number of times.
// In testing, no more than one attempt has been needed but it's best to have a failsafe to
// ensure scrolling doesn't enter an infinite loop
const MAXIMUM_SCROLL_ATTEMPTS = 0;

// http://blog.greweb.fr/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
function EASE_IN_OUT(t) {
    if (t < .5) { return 4 * t * t * t; } else { return ((t - 1) * ((2 * t) - 2) * ((2 * t) - 2)) + 1; }
}

function POSITION(start, end, elapsed, duration) {
    if (elapsed > duration) { return end; }
    return start + ((end - start) * EASE_IN_OUT(elapsed / duration));
}

export default class ScrollTo {

    constructor({ windowImpl = window, onAfterScroll, root, scrollingTargetClass } = {}) {
        this.onAfterScroll = onAfterScroll;
        this.windowImpl = windowImpl;
        this.root = root || this.windowImpl.document.body;
        this.scrollingTargetClass = scrollingTargetClass;
    }

    scrollToSelector(selector, options) {
        options = extend({
            updateHistory: true, unlessInView: false,
        }, options);

        if (options.deferred) {
            return new Promise(resolve => {
                delay(() => {
                    this
                        .scrollToSelector(selector, omit(options, 'deferred'))
                        .then(resolve);
                }, 10);
            });
        }

        const el = this.getElement(selector);
        if (el && (!options.unlessInView || !this.isElementInView(el))) {
            return this.scrollToElement(el, options);
        }
        return Promise.resolve(false);
    }

    isSelectorInView(selector) {
        const el = this.getElement(selector);
        if (!el) { return false; }

        return this.isElementInView(el);
    }

    isElementInView(el) {
        const { top, bottom, height } = el.getBoundingClientRect();
        const visibleHeight = Math.min(window.innerHeight, bottom) - Math.max(0, top);

        return visibleHeight > (height / 2);
    }

    getElement(selector) {
        if (isEmpty(selector)) { return null; }
        return this.root.querySelector(selector);
    }

    _onBeforeScroll(el) {
        if (this.scrollingTargetClass) { el.classList.add(this.scrollingTargetClass); }
        // 'target-scroll');
        return (typeof this.onBeforeScroll === 'function' ? this.onBeforeScroll(el) : undefined);
    }

    _onAfterScroll(el, options) {
        const cl = get(el, 'classList');
        if (cl && cl.contains('target-scroll')) {
            delay(cl.remove.bind(el.classList, 'target-scroll'), 150);
        }
        if (options.updateHistory) {
            this.windowImpl.history.pushState(null, null, `#${el.id}`);
        }
        if (this.whenScrollCompete) {
            this.whenScrollCompete();
            this.whenScrollCompete = null;
        }
        return (typeof this.onAfterScroll === 'function' ? this.onAfterScroll(el) : undefined);

    }

    _onScrollStep(el, options) {
    // The element's postion may have changed if scrolling was initiated while
    // the page was still being manipulated.
    // If that's the case, we begin another scroll to it's current position
        if ((options.attemptNumber < MAXIMUM_SCROLL_ATTEMPTS) && (this.windowImpl.pageYOffset !== this._desiredTopPosition(el, options))) {
            return this.scrollToElement(el, extend(options, { attemptNumber: options.attemptNumber + 1 }));
        } else {
            return this._onAfterScroll(el, options);
        }
    }

    _desiredTopPosition(el, options ) {
        if (options == null) { options = {}; }

        return GetPositionMixin.getTopPosition(el) - (
            options.scrollTopOffset || result(this, 'getScrollTopOffset', DEFAULT_TOP_OFFSET)
        );
    }

    scrollToTop(options) {
        const root = this.windowImpl.document.body.querySelector('#ox-react-root-container');
        if (root) {
            return this.scrollToElement(root, extend({}, options, { updateHistory: false }));
        }
        return Promise.resolve();
    }

    scrollToElement(el, options = {}) {
        if (!el.parentElement) { return Promise.resolve(); } // the element has been deleted
        if (options.deferred) {
            return new Promise(resolve => {
                delay(() => {
                    this
                        .scrollToElement(el, omit(options, 'deferred'))
                        .then(resolve);
                }, 10);
            });
        }
        if (options.afterImagesLoaded) {
            return imagesComplete()
                .then(() =>
                    this.scrollToElement(el, omit(options, 'afterImagesLoaded'))
                );

        }
        const win       = this.windowImpl;
        const endPos    = this._desiredTopPosition(el, options);

        if (options.immediate === true) {
            win.scroll(0, endPos);
            this._onAfterScroll(el, options);
            return Promise.resolve();
        }

        const startPos  = win.pageYOffset;
        const startTime = Date.now();
        const duration  = result(this, 'getScrollDuration', DEFAULT_DURATION);
        const requestAnimationFrame = win.requestAnimationFrame || delay;
        if (!options.attemptNumber) { options.attemptNumber = 0; }

        const step = () => {
            const elapsed = Date.now() - startTime;
            win.scroll(0, POSITION(startPos, endPos, elapsed, duration) );
            if (elapsed < duration) { return requestAnimationFrame(step);
            } else { return this._onScrollStep(el, options); }
        };

        this._onBeforeScroll(el);
        step();
        return new Promise((resolve) => this.whenScrollCompete = resolve);
    }
}
