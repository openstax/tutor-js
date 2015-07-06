_ = require 'underscore'

MATH_MARKER_BLOCK  = '\u200c\u200c\u200c' # zero-width non-joiner
MATH_MARKER_INLINE = '\u200b\u200b\u200b' # zero-width space

cleanMathArtifacts = ->
  # Once MathJax finishes processing, cleanup the MathJax message nodes to prevent
  # React "Invariant Violation" exceptions.
  # MathJax calls queued events in order, so this will be called after processing completes
  window.MathJax.Hub.Queue([ ->
    # copy-pasta in `/index.coffee`
    for nodeId in ['MathJax_Message', 'MathJax_Hidden', 'MathJax_Font_Test']
      el = document.getElementById(nodeId)
      break unless el # the elements won't exist if MathJax didn't do anything
      # Some of the elements are wrapped by divs without selectors under body
      # Select the parentElement unless it's already directly under body.
      el = el.parentElement unless el.parentElement is document.body
      el.parentElement.removeChild(el)
  ])


typesetMath = (root) ->
  nodes = root.querySelectorAll('[data-math]:not(.math-rendered)') or []
  hasMath = root.querySelector('math')

  # Return immediatly if no [data-math] or <math> elements are present
  # TODO: If the MathJax Queue is not available then MathJax has not loaded yet. Add a load callback to enqueue.
  return unless window.MathJax?.Hub?.Queue? and (_.any(nodes) or hasMath)

  for node in nodes
    formula = node.getAttribute('data-math')
    # divs with data-math should be rendered as a block
    if node.tagName.toLowerCase() is 'div'
      node.textContent = "#{MATH_MARKER_BLOCK}#{formula}#{MATH_MARKER_BLOCK}"
    else
      node.textContent = "#{MATH_MARKER_INLINE}#{formula}#{MATH_MARKER_INLINE}"
    window.MathJax.Hub.Queue(['Typeset', MathJax.Hub, node])
    # mark node as processed
    node.classList.add('math-rendered')

  # render MathML with MathJax
  window.MathJax.Hub.Queue(['Typeset', MathJax.Hub, root]) if hasMath

  cleanMathArtifacts()


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
    configuredCallback()
  else
    # If the MathJax.js file has not loaded yet:
    # Call MathJax.Configured once MathJax loads and
    # loads this config JSON since the CDN URL
    # says to `delayStartupUntil=configured`
    MATHJAX_CONFIG.AuthorInit = configuredCallback

    window.MathJax = MATHJAX_CONFIG


module.exports = {typesetMath, startMathJax}
