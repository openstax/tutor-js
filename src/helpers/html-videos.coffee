{ each } = require 'lodash'

getRatioClass = (frame) ->
  if (not frame.width or not frame.height)
    return "embed-responsive-16by9"

  ratio = frame.width / frame.height
  if (Math.abs(ratio - 16 / 9) > Math.abs(ratio - 4 / 3))
    return "embed-responsive-4by3"
  else
    return "embed-responsive-16by9"


wrapFrames = (dom) ->
  each(dom.getElementsByTagName('iframe'), (frame) ->
    if (frame.parentNode?.classList.contains('embed-responsive')) then return

    wrapper = document.createElement("div")
    wrapper.className = "frame-wrapper embed-responsive #{getRatioClass(frame)}"
    dom.replaceChild(wrapper, frame)
    wrapper.appendChild(frame)
  )

  dom

module.exports = { wrapFrames, getRatioClass }
