import { debounce, toArray } from 'lodash'


const MATH_MARKER_BLOCK = '\u200c\u200c\u200c' // zero-width non-joiner
const MATH_MARKER_INLINE = '\u200b\u200b\u200b' // zero-width space

const MATH_RENDERED_CLASS = 'math-rendered'
const MATH_DATA_SELECTOR = `[data-math]:not(.${MATH_RENDERED_CLASS})`
const MATH_ML_SELECTOR = `math:not(.${MATH_RENDERED_CLASS})`

declare global {
    interface Window {
        MathJax: any
    }
}

const typesetMath = debounce((windowImpl: Window = window) => {
    // Search document for math and [data-math] elements and then typeset them

    const { document } = windowImpl
    const mathjax = windowImpl.MathJax
    if (!mathjax) { return }

    let nodes: Element[] = []

    document.querySelectorAll(MATH_DATA_SELECTOR).forEach((node) => {
        const formula = node.getAttribute('data-math')
        // divs should be rendered as a block, others inline
        if (node.tagName.toLowerCase() === 'div') {
            node.textContent = MATH_MARKER_BLOCK + formula + MATH_MARKER_BLOCK
        } else {
            node.textContent = MATH_MARKER_INLINE + formula + MATH_MARKER_INLINE
        }
        nodes.push(node)
    })

    mathjax.typesetPromise([document, nodes]).then(() => {
        // Individual MathML nodes can't be typeset so we have to send document,
        // assume they were rendered too when updating classes so the bug mentioned
        // in the startup initalizer below can be avoided
        nodes = nodes.concat(toArray(document.querySelectorAll(MATH_ML_SELECTOR)))

        for (const node of nodes) {
            node.className += ` ${MATH_RENDERED_CLASS}`
        }
    })

}, 100)

// typesetMath is the main exported function.
// It's called by components like HTML after they're rendered

// The following should be called once and configures MathJax.
const startMathJax = function() {
    window.MathJax = {
        tex: {
            displayMath: [[MATH_MARKER_BLOCK, MATH_MARKER_BLOCK]],
            inlineMath: [[MATH_MARKER_INLINE, MATH_MARKER_INLINE]],
        },
        svg: {
            fontCache: 'global',
        },
        startup: {
            // There's a bug in MathJax that causes subsequent renders to typeset the assistiveMML <math>
            // child node embedded in the typeset container. Unfortunately just setting the node class won't
            // work because the ignoreHtmlClass config setting doesn't work for MathML nodes, so use a custom
            // finder from https://github.com/mathjax/MathJax/issues/2770
            ready() {
                const { combineDefaults } = window.MathJax._.components.global
                const { FindMathML } = window.MathJax._.input.mathml.FindMathML

                class myFindMathML extends FindMathML {
                    processMath(set: Set<Node>) {
                        const adaptor = this.adaptor
                        for (const node of set.values()) {
                            if (adaptor.hasClass(node, MATH_RENDERED_CLASS)) {
                                set.delete(node)
                            }
                        }
                        return super.processMath(set)
                    }
                }

                combineDefaults(window.MathJax.config, 'mml', { FindMathML: new myFindMathML() })

                window.MathJax.startup.defaultReady()
            },
        },
    };

    (function() {
        var script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.0/es5/tex-mml-chtml.min.js'
        script.async = true
        document.head.appendChild(script)
    })()
}

export {
    typesetMath,
    startMathJax,
}
