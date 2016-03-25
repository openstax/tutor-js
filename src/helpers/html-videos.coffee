{ each } = require 'lodash'

getRatioClass = (frame) ->
  if (!frame.width || !frame.height)
    return "embed-responsive-16by9"

  ratio = frame.width / frame.height
  if (Math.abs(ratio - 16/9) > Math.abs(ratio - 4/3))
    return "embed-responsive-4by3"
  else
    return "embed-responsive-16by9"


wrapVideos = (html) ->
  dom = document.createElement("div")
  dom.innerHTML = html

  each(dom.getElementsByTagName('iframe'), (frame) ->
    wrapper = document.createElement("div")
    wrapper.className="embed-responsive #{getRatioClass(frame)}"
    dom.replaceChild(wrapper, frame)
    wrapper.appendChild(frame)
  )

  dom.innerHTML

module.exports = { wrapVideos, getRatioClass }
