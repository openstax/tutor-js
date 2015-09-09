React = require 'react'
_ = require 'underscore'

# Note that the Position mixin methods are called directly rather than mixing it in
# since we're a mixin ourselves our consumers also include GetPosition and it causes
# duplicate method name errors to mix it in
Position = require './get-position-mixin'

DEFAULT_DURATION   = 750 # milliseconds
DEFAULT_TOP_OFFSET = 80  # pixels

# http://blog.greweb.fr/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
EASE_IN_OUT = (t) ->
  if t < .5 then 4 * t * t * t else (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

POSITION = (start, end, elapsed, duration) ->
  return end if (elapsed > duration)
  start + (end - start) * EASE_IN_OUT(elapsed / duration)

ScrollTo =
  getDefaultProps: ->
    windowImpl: window

  componentDidMount:  ->
    root = React.findDOMNode(@)
    # cache the window's href
    unless _.isEmpty(@props.windowImpl.location.hash)
      @scrollToSelector(@props.windowImpl.location.hash)
    root.addEventListener('click', @_onScrollClick, false)

  componentWillUnmount: ->
    React.findDOMNode(@).removeEventListener('click', @_onScrollClick, false)

  scrollToSelector: (selector) ->
    root = React.findDOMNode(@)
    el = root.querySelector(selector)
    if el
      @scrollToElement(el)
      true
     else
      false

  _onScrollClick: (ev) ->
    return unless ev.target.tagName is 'A'
    if @scrollToSelector(ev.target.hash)
      ev.preventDefault()

  scrollToElement: (el) ->
    startPos  = @props.windowImpl.pageYOffset
    endPos    = Position.getTopPosition(el) - _.result(@, 'getScrollTopOffset', DEFAULT_TOP_OFFSET)
    startTime = Date.now()
    duration  = _.result(@, 'getScrollDuration', DEFAULT_DURATION)
    win = @props.windowImpl
    requestAnimationFrame = win.requestAnimationFrame or _.defer

    step = ->
      elapsed = Date.now() - startTime
      console.log "SCROP"
      win.scroll(0, POSITION(startPos, endPos, elapsed, duration) )
      requestAnimationFrame(step) if elapsed < duration
    step()



module.exports = ScrollTo
