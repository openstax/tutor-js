_ = require 'underscore'

getRatioClass = (frame) ->
  if (not frame.width or not frame.height)
    return "embed-responsive-16by9"

  ratio = frame.width / frame.height
  if (Math.abs(ratio - 16 / 9) > Math.abs(ratio - 4 / 3))
    return "embed-responsive-4by3"
  else
    return "embed-responsive-16by9"

isEmbedded = (frame) ->
  frame.parentNode?.classList.contains('embed-responsive')

isInteractive = (frame) ->
  frame.classList.contains('interactive')

wrapFrames = (dom, shouldExcludeFrame) ->
  _.each(dom.getElementsByTagName('iframe'), (frame) ->
    return null if isEmbedded(frame) or isInteractive(frame) or shouldExcludeFrame?(frame)

    wrapper = document.createElement("div")
    wrapper.className = "frame-wrapper embed-responsive #{getRatioClass(frame)}"
    frame.parentNode.replaceChild(wrapper, frame)
    wrapper.appendChild(frame)
  )

  dom

module.exports = { wrapFrames, getRatioClass }
