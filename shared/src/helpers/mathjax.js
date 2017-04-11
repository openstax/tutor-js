import { isEmpty, toArray, debounce } from 'lodash';

import 'mathjax';
MathJax.Hub.Config({delayJaxRegistration: true});

// import 'mathjax/config/TeX-MML-AM_HTMLorMML-full.js';
import 'mathjax/jax/input/TeX/config.js';
import 'mathjax/jax/input/MathML/config.js';
import 'mathjax/jax/input/AsciiMath/config.js';
import 'mathjax/jax/output/HTML-CSS/config.js';
import 'mathjax/jax/output/NativeMML/config.js';
import 'mathjax/jax/output/PreviewHTML/config.js';
import 'mathjax/config/MMLorHTML.js';
import 'mathjax/extensions/tex2jax.js';
import 'mathjax/extensions/mml2jax.js';
import 'mathjax/extensions/asciimath2jax.js';
import 'mathjax/extensions/MathEvents.js';
import 'mathjax/extensions/MathZoom.js';
import 'mathjax/extensions/MathMenu.js';
import 'mathjax/jax/element/mml/jax.js';
import 'mathjax/extensions/toMathML.js';
import 'mathjax/extensions/TeX/noErrors.js';
import 'mathjax/extensions/TeX/noUndefined.js';
import 'mathjax/jax/input/TeX/jax.js';
import 'mathjax/extensions/TeX/AMSmath.js';
import 'mathjax/extensions/TeX/AMSsymbols.js';
import 'mathjax/jax/input/MathML/jax.js';
import 'mathjax/jax/input/AsciiMath/jax.js';
import 'mathjax/jax/output/NativeMML/jax.js';
import 'mathjax/jax/output/HTML-CSS/jax.js';
import 'mathjax/jax/output/HTML-CSS/autoload/mtable.js';
import 'mathjax/jax/output/PreviewHTML/jax.js';
import 'mathjax/extensions/fast-preview.js';
import 'mathjax/extensions/AssistiveMML.js';


import 'shared/resources/styles/mathjax.less';

const MATH_MARKER_BLOCK  = '\u200c\u200c\u200c'; // zero-width non-joiner
const MATH_MARKER_INLINE = '\u200b\u200b\u200b'; // zero-width space

const MATH_RENDERED_CLASS = 'math-rendered';
const MATH_DATA_SELECTOR = `[data-math]:not(.${MATH_RENDERED_CLASS})`;
const MATH_ML_SELECTOR   = `math:not(.${MATH_RENDERED_CLASS})`;
const COMBINED_MATH_SELECTOR = `${MATH_DATA_SELECTOR}, ${MATH_ML_SELECTOR}`;
const MATHJAX_CONFIG = {
  showProcessingMessages: false,
  tex2jax: {
    displayMath: [[MATH_MARKER_BLOCK, MATH_MARKER_BLOCK]],
    inlineMath:  [[MATH_MARKER_INLINE, MATH_MARKER_INLINE]],
  },
  'HTML-CSS': {
    preferredFont: 'Tex',
  },
  availableFonts: [ 'Tex'],
  styles: {
    '#MathJax_Message': {
      visibility: 'hidden', left: '', right: 0,
    },
    '#MathJax_MSIE_Frame': {
      visibility: 'hidden', left: '', right: 0,
    },
  },
};

// Search document for math and [data-math] elements and then typeset them
let typesetDocument = function(windowImpl) {
  const latexNodes = [];
  for (var node of Array.from(windowImpl.document.querySelectorAll(MATH_DATA_SELECTOR))) {
    const formula = node.getAttribute('data-math');
    // divs should be rendered as a block, others inline
    if (node.tagName.toLowerCase() === 'div') {
      node.textContent = `${MATH_MARKER_BLOCK}${formula}${MATH_MARKER_BLOCK}`;
    } else {
      node.textContent = `${MATH_MARKER_INLINE}${formula}${MATH_MARKER_INLINE}`;
    }
    latexNodes.push(node);
  }

  if (!isEmpty(latexNodes)) {
    windowImpl.MathJax.Hub.Typeset(latexNodes);
  }

  const mathMLNodes = toArray(windowImpl.document.querySelectorAll(MATH_ML_SELECTOR));
  if (!isEmpty(mathMLNodes)) {
    // style the entire document because mathjax is unable to style individual math elements
    windowImpl.MathJax.Hub.Typeset( windowImpl.document );
  }

  return windowImpl.MathJax.Hub.Queue(() =>
    // Queue a call to mark the found nodes as rendered so are ignored if typesetting is called repeatedly
    // uses className += instead of classList because IE
    (() => {
      const result = [];
      for (node of Array.from(latexNodes.concat(mathMLNodes))) {
        result.push(node.className += ` ${MATH_RENDERED_CLASS}`);
      }
      return result;
    })()
  );
};

// Install a debounce around typesetting function so that it will only run once
// every Xms even if called multiple times in that period
typesetDocument = debounce( typesetDocument, 100);

// typesetMath is the main exported function.
// It's called by components like HTML after they're rendered
const typesetMath = function(root, windowImpl) {
  // schedule a Mathjax pass if there is at least one [data-math] or <math> element present

  if (windowImpl == null) { windowImpl = window; }

  if ((__guard__(__guard__(windowImpl.MathJax, x1 => x1.Hub), x => x.Queue) != null) && root.querySelector(COMBINED_MATH_SELECTOR)) {
    return typesetDocument(windowImpl);
  }
};


// The following should be called once and configures MathJax.
// Assumes the script to load MathJax is of the form:
// `...MathJax.js?config=TeX-MML-AM_HTMLorMML-full&amp;delayStartupUntil=configured`
const startMathJax = function() {

  const configuredCallback = () => window.MathJax.Hub.Configured();

  if (__guard__(window.MathJax, x => x.Hub)) {
    window.MathJax.Hub.Config(MATHJAX_CONFIG);
    // Does not seem to work when passed to Config
    window.MathJax.Hub.processSectionDelay = 0;
    return configuredCallback();

    MathJax.Hub.Register.MessageHook("Math Processing Error",function (message) {
      debugger
  //  do something with the error.  message[2] is the Error object that records the problem.
    });
  } else {
    // If the MathJax.js file has not loaded yet:
    // Call MathJax.Configured once MathJax loads and
    // loads this config JSON since the CDN URL
    // says to `delayStartupUntil=configured`
    MATHJAX_CONFIG.AuthorInit = configuredCallback;

    return window.MathJax = MATHJAX_CONFIG;
  }
};


export { typesetMath, startMathJax };

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
