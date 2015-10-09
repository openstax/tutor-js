React = require 'react'
_ = require 'underscore'

# Note that the Position mixin methods are called directly rather than mixing it in
# since we're a mixin ourselves our consumers also include GetPosition and it causes
# duplicate method name errors to mix it in
Position = require './get-position-mixin'

DEFAULT_DURATION   = 750 # milliseconds
# This is calculated to be enough for the targeted element to fit under the top navbar
# The navbar's height is controlled by the less variable @tutor-navbar-height from global/navbar.less
DEFAULT_TOP_OFFSET = 80  # pixels

# Attempt to scroll to element no more than this number of times.
# In testing, no more than one attempt has been needed but it's best to have a failsafe to
# ensure scrolling doesn't enter an infinite loop
MAXIMUM_SCROLL_ATTEMPTS = 3

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
    React.findDOMNode(@)
      .addEventListener('click', @_onScrollClick, false)

    # if a hash is present and it can be scrolled to
    # clear the window's existing hash so that the browser won't jump directly to it
    hash = @props.windowImpl.location.hash
    if hash
      @props.windowImpl.location.hash = ""
      @waitToScrollToSelector?(hash) or @scrollToSelector(hash)

    # listen for forward / back navigation between element selections
    @props.windowImpl.addEventListener('hashchange', @_onHashChange, false)

  componentWillUnmount: ->
    React.findDOMNode(@).removeEventListener('click', @_onScrollClick, false)
    @props.windowImpl.removeEventListener('hashchange', @_onHashChange, false)

  scrollToSelector: (selector) ->
    return if _.isEmpty(selector)
    root = React.findDOMNode(@)
    el = root.querySelector(selector)
    @scrollToElement(el) if el

  _onHashChange: ->
    if @props.windowImpl.location.hash
      @scrollToSelector(@props.windowImpl.location.hash)

  _onScrollClick: (ev) ->
    return unless ev.target.tagName is 'A'
    if @scrollToSelector(ev.target.hash)
      ev.preventDefault()

  _desiredTopPosition: (el) ->
    Position.getTopPosition(el) - _.result(@, 'getScrollTopOffset', DEFAULT_TOP_OFFSET)

  _onBeforeScroll: (el) ->
    el.classList.add('target-scroll')
    @onBeforeScroll?(el)

  _onAfterScroll: (el) ->
    if el?.classList?.contains('target-scroll')
      _.delay(el.classList.remove.bind(el.classList, 'target-scroll'), 150)
    @props.windowImpl.history.pushState(null, null, "##{el.id}")
    @onAfterScroll?(el)

  _onScrollStep: (el, attemptNumber) ->
    # The element's postion may have changed if scrolling was initiated while
    # the page was still being manipulated.
    # If that's the case, we begin another scroll to it's current position
    if attemptNumber < MAXIMUM_SCROLL_ATTEMPTS and @props.windowImpl.pageYOffset isnt @_desiredTopPosition(el)
      @scrollToElement(el, attemptNumber + 1)
    else
      @_onAfterScroll(el)

  scrollToElement: (el, attemptNumber = 0) ->
    win       = @props.windowImpl
    startPos  = win.pageYOffset
    endPos    = @_desiredTopPosition(el)
    startTime = Date.now()
    duration  = _.result(@, 'getScrollDuration', DEFAULT_DURATION)
    requestAnimationFrame = win.requestAnimationFrame or _.defer

    step = =>
      elapsed = Date.now() - startTime
      win.scroll(0, POSITION(startPos, endPos, elapsed, duration) )
      if elapsed < duration then requestAnimationFrame(step)
      else @_onScrollStep(el, attemptNumber)

    @_onBeforeScroll(el)
    step()



module.exports = ScrollTo
