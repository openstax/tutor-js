_ = require 'underscore'

MATH_MARKER_BLOCK  = '\u200c\u200c\u200c' # zero-width non-joiner
MATH_MARKER_INLINE = '\u200b\u200b\u200b' # zero-width space

MATH_RENDERED_CLASS = 'math-rendered'
MATH_DATA_SELECTOR = "[data-math]:not(.#{MATH_RENDERED_CLASS})"
MATH_ML_SELECTOR   = "math:not(.#{MATH_RENDERED_CLASS})"
COMBINED_MATH_SELECTOR = "#{MATH_DATA_SELECTOR}, #{MATH_ML_SELECTOR}"

# Search document for math and [data-math] elements and then typeset them
typesetDocument = (windowImpl) ->
  latexNodes = []
  for node in windowImpl.document.querySelectorAll(MATH_DATA_SELECTOR)
    formula = node.getAttribute('data-math')
    # divs should be rendered as a block, others inline
    if node.tagName.toLowerCase() is 'div'
      node.textContent = "#{MATH_MARKER_BLOCK}#{formula}#{MATH_MARKER_BLOCK}"
    else
      node.textContent = "#{MATH_MARKER_INLINE}#{formula}#{MATH_MARKER_INLINE}"
    latexNodes.push(node)

  unless _.isEmpty(latexNodes)
    windowImpl.MathJax.Hub.Typeset(latexNodes)

  mathMLNodes = _.toArray(windowImpl.document.querySelectorAll(MATH_ML_SELECTOR))
  unless _.isEmpty(mathMLNodes)
    # style the entire document because mathjax is unable to style individual math elements
    windowImpl.MathJax.Hub.Typeset( windowImpl.document )

  windowImpl.MathJax.Hub.Queue ->
    # Queue a call to mark the found nodes as rendered so are ignored if typesetting is called repeatedly
    # uses className += instead of classList because IE
    for node in latexNodes.concat(mathMLNodes)
      node.className += " #{MATH_RENDERED_CLASS}"

# Install a debounce around typesetting function so that it will only run once
# every Xms even if called multiple times in that period
typesetDocument = _.debounce( typesetDocument, 100)

# typesetMath is the main exported function.
# It's called by components like HTML after they're rendered
typesetMath = (root, windowImpl = window) ->
  # schedule a Mathjax pass if there is at least one [data-math] or <math> element present

  if windowImpl.MathJax?.Hub?.Queue? and root.querySelector(COMBINED_MATH_SELECTOR)
    typesetDocument(windowImpl)


# The following should be called once and configures MathJax.
# Assumes the script to load MathJax is of the form:
# `...MathJax.js?config=TeX-MML-AM_HTMLorMML-full&amp;delayStartupUntil=configured`
startMathJax = ->
  MATHJAX_CONFIG =
    showProcessingMessages: false
    extensions: ["AssistiveMML.js"]
    tex2jax:
      displayMath: [[MATH_MARKER_BLOCK, MATH_MARKER_BLOCK]]
      inlineMath:  [[MATH_MARKER_INLINE, MATH_MARKER_INLINE]]
     AssistiveMML:
       disabled: false
       styles:
         ".MJX_Assistive_MathML":
           position:"absolute!important",
           clip: "rect(1px, 1px, 1px, 1px)",
           padding: "1px 0 0 0!important",
           border: "0!important",
           height: "1px!important",
           width: "1px!important",
           overflow: "hidden!important",
           display:"block!important"

  configuredCallback = ->
    window.MathJax.Hub.Configured()

  if window.MathJax?.Hub
    window.MathJax.Hub.Config(MATHJAX_CONFIG)
    # Does not seem to work when passed to Config
    window.MathJax.Hub.processSectionDelay = 0
    configuredCallback()
  else
    # If the MathJax.js file has not loaded yet:
    # Call MathJax.Configured once MathJax loads and
    # loads this config JSON since the CDN URL
    # says to `delayStartupUntil=configured`
    MATHJAX_CONFIG.AuthorInit = configuredCallback

    window.MathJax = MATHJAX_CONFIG


module.exports = {typesetMath, startMathJax}
