_ = require 'underscore'

MATH_MARKER_BLOCK  = '\u200c\u200c\u200c' # zero-width non-joiner
MATH_MARKER_INLINE = '\u200b\u200b\u200b' # zero-width space

MATH_SELECTOR = '[data-math]:not(.math-rendered), math:not(.math-rendered)'

cleanMathArtifacts = ->
  # Once MathJax finishes processing, cleanup the MathJax message nodes to prevent
  # React "Invariant Violation" exceptions.
  # MathJax calls queued events in order, so this will be called after processing completes
  window.MathJax.Hub.Queue([ ->
    # copy-pasta in `/index.coffee`
    for nodeId in ['MathJax_Message', 'MathJax_Font_Test']
      el = document.getElementById(nodeId)
      break unless el # the elements won't exist if MathJax didn't do anything
      # Some of the elements are wrapped by divs without selectors under body
      # Select the parentElement unless it's already directly under body.
      el = el.parentElement unless el.parentElement is document.body
      el.parentElement.removeChild(el)
  ])



# Typesets the entire document
typesetDocument = ->

  nodes = document.querySelectorAll(MATH_SELECTOR)
  return if _.isEmpty(nodes)

  for node in nodes
    node.classList.add('math-rendered')
    # math elements are corrupted when the marker is inserted
    continue if node.tagName is 'math'

    formula = node.getAttribute('data-math')
    # divs with data-math should be rendered as a block
    if node.tagName.toLowerCase() is 'div'
      node.textContent = "#{MATH_MARKER_BLOCK}#{formula}#{MATH_MARKER_BLOCK}"
    else
      node.textContent = "#{MATH_MARKER_INLINE}#{formula}#{MATH_MARKER_INLINE}"

  # submit all nodes at once for optimal rendering performance
  window.MathJax.Hub.Queue(['Typeset', MathJax.Hub, _.toArray(nodes)])

  cleanMathArtifacts()

# Install a debounce around typesetting function so that it will only run once
# every 10ms even if called multiple calls times in that period
typesetDocument = _.debounce( typesetDocument, 10)


# typesetMath is the main exported function.
# It's called by components like HTML after they're rendered
typesetMath = (root) ->
  # schedule a Mathjax pass if there is at least one [data-math] or <math> element present
  if window.MathJax?.Hub?.Queue? and root.querySelector(MATH_SELECTOR)
    typesetDocument()


# The following should be called once and configures MathJax.
# Assumes the script to load MathJax is of the form:
# `...MathJax.js?config=TeX-MML-AM_HTMLorMML-full&amp;delayStartupUntil=configured`
startMathJax = ->
  MATHJAX_CONFIG =
    showProcessingMessages: false
    tex2jax:
      displayMath: [[MATH_MARKER_BLOCK, MATH_MARKER_BLOCK]]
      inlineMath:  [[MATH_MARKER_INLINE, MATH_MARKER_INLINE]]
    styles:
      '#MathJax_Message':    visibility: 'hidden', left: '', right: 0
      '#MathJax_MSIE_Frame': visibility: 'hidden', left: '', right: 0

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
