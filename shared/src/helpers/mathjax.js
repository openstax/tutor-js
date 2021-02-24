import { get, isEmpty, debounce, toArray } from 'lodash';

const MATH_MARKER_BLOCK  = '\u200c\u200c\u200c'; // zero-width non-joiner
const MATH_MARKER_INLINE = '\u200b\u200b\u200b'; // zero-width space

const MATH_RENDERED_CLASS = 'math-rendered';
const MATH_DATA_SELECTOR = `[data-math]:not(.${MATH_RENDERED_CLASS})`;
const MATH_ML_SELECTOR   = `math:not(.${MATH_RENDERED_CLASS})`;
const COMBINED_MATH_SELECTOR = `${MATH_DATA_SELECTOR}, ${MATH_ML_SELECTOR}`;

const typesetMath = debounce((windowImpl = window) => {
    // Search document for math and [data-math] elements and then typeset them
    const { document } = windowImpl;
    const Hub = windowImpl.MathJax && windowImpl.MathJax.Hub;
    if (!Hub) { return; }

    const latexNodes = [];
    for (const node of document.querySelectorAll(MATH_DATA_SELECTOR)) {
        const formula = node.getAttribute('data-math');
        // divs should be rendered as a block, others inline
        if (node.tagName.toLowerCase() === 'div') {
            node.textContent = `${MATH_MARKER_BLOCK}${formula}${MATH_MARKER_BLOCK}`;
        } else {
            node.textContent = `${MATH_MARKER_INLINE}${formula}${MATH_MARKER_INLINE}`;
        }
        latexNodes.push(node);
    }

    Hub.Queue(
        () => {
            if (isEmpty(latexNodes)) {
                return;
            }
            Hub.Typeset(latexNodes);
        },
        () => {
            const mathMLNodes = toArray(document.querySelectorAll(MATH_ML_SELECTOR));

            if (isEmpty(mathMLNodes)) {
                return;
            }
            // style the entire document because mathjax is unable to style individual math elements
            Hub.Typeset( document );
        },
        () => {
            // Queue a call to mark the found nodes as rendered so are ignored if typesetting is called repeatedly
            // uses className += instead of classList because IE
            const result = [];
            for (const node of latexNodes) {
                result.push(node.className += ` ${MATH_RENDERED_CLASS}`);
            }
        }
    );
}, 100);

// memoize'd getter for typeset document function so that each node's
// typeset has its own debounce
// const getTypesetDocument = memoize((root, windowImpl) => {
//   // Install a debounce around typesetting function so that it will only run once
//   // every Xms even if called multiple times in that period
//   return typesetDocument, 100).bind(null, root, windowImpl);
// });
// getTypesetDocument.cache = new WeakMap();

// typesetMath is the main exported function.
// It's called by components like HTML after they're rendered


// The following should be called once and configures MathJax.
// Assumes the script to load MathJax is of the form:
// `...MathJax.js?config=TeX-MML-AM_HTMLorMML-full&amp;delayStartupUntil=configured`
const startMathJax = function() {
    const MATHJAX_CONFIG = {
        showProcessingMessages: false,
        extensions: ['[a11y]/explorer.js'],
        tex2jax: {
            displayMath: [[MATH_MARKER_BLOCK, MATH_MARKER_BLOCK]],
            inlineMath:  [[MATH_MARKER_INLINE, MATH_MARKER_INLINE]],
        },
        styles: {
            '#MathJax_Message': {
                visibility: 'hidden', left: '', right: 0,
            },
            '#MathJax_MSIE_Frame': {
                visibility: 'hidden', left: '', right: 0,
            },
        },
    };
    const configuredCallback = () => window.MathJax.Hub.Configured();

    if (get(window, 'MathJax.Hub')) {
        window.MathJax.Hub.Config(MATHJAX_CONFIG);
        // Does not seem to work when passed to Config
        window.MathJax.Hub.processSectionDelay = 0;
        return configuredCallback();
    } else {
    // If the MathJax.js file has not loaded yet:
    // Call MathJax.Configured once MathJax loads and
    // loads this config JSON since the CDN URL
    // says to `delayStartupUntil=configured`
        MATHJAX_CONFIG.AuthorInit = configuredCallback;
        return window.MathJax = MATHJAX_CONFIG;
    }
};

export {
    typesetMath,
    startMathJax,
};
