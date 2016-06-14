React = require 'react'
_ = require 'underscore'

# Note that the GetPositionMixin methods are called directly rather than mixing it in
# since we're a mixin ourselves our consumers also include GetPosition and it causes
# duplicate method name errors to mix it in
{GetPositionMixin} = require 'openstax-react-components'

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

ScrollToMixin =
  getDefaultProps: ->
    windowImpl: window

  _scrollingTargetDOM: -> @scrollingTargetDOM?() or React.findDOMNode(@)

  scrollToSelector: (selector, options) ->
    return if _.isEmpty(selector)
    options = _.extend({updateHistory: true}, options)

    el = @_scrollingTargetDOM().querySelector(selector)
    @scrollToElement(el, options) if el

  _onBeforeScroll: (el) ->
    el.classList.add('target-scroll')
    @onBeforeScroll?(el)

  _onAfterScroll: (el, options) ->
    if el?.classList?.contains('target-scroll')
      _.delay(el.classList.remove.bind(el.classList, 'target-scroll'), 150)
    @props.windowImpl.history.pushState(null, null, "##{el.id}") if options.updateHistory
    @onAfterScroll?(el)

  _onScrollStep: (el, options) ->
    # The element's postion may have changed if scrolling was initiated while
    # the page was still being manipulated.
    # If that's the case, we begin another scroll to it's current position
    if options.attemptNumber < MAXIMUM_SCROLL_ATTEMPTS and @props.windowImpl.pageYOffset isnt @_desiredTopPosition(el)
      @scrollToElement(el, options.attemptNumber + 1)
    else
      @_onAfterScroll(el, options)

  _desiredTopPosition: (el) ->
    GetPositionMixin.getTopPosition(el) - _.result(@, 'getScrollTopOffset', DEFAULT_TOP_OFFSET)

  scrollToElement: (el, options = {} ) ->
    win       = @props.windowImpl
    endPos    = @_desiredTopPosition(el)

    if options.immediate is true
      win.scroll(0, endPos)
      return

    startPos  = win.pageYOffset
    startTime = Date.now()
    duration  = _.result(@, 'getScrollDuration', DEFAULT_DURATION)
    requestAnimationFrame = win.requestAnimationFrame or _.defer
    options.attemptNumber ||= 0

    step = =>
      elapsed = Date.now() - startTime
      win.scroll(0, POSITION(startPos, endPos, elapsed, duration) )
      if elapsed < duration then requestAnimationFrame(step)
      else @_onScrollStep(el, options)

    @_onBeforeScroll(el)
    step()



module.exports = ScrollToMixin
