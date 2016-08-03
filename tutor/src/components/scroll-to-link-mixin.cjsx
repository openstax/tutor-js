React = require 'react'

{ScrollToMixin} = require 'shared'

# This mixin extends the scroll-to-mixin to handle
# scrolling to a link when it's clicked
ScrollToLinkMixin =
  mixins: [ScrollToMixin]

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

  _onHashChange: ->
    if @props.windowImpl.location.hash
      @scrollToSelector(@props.windowImpl.location.hash)

  _onScrollClick: (ev) ->
    return unless ev.target.tagName is 'A'
    if @scrollToSelector(ev.target.hash)
      ev.preventDefault()

module.exports = ScrollToLinkMixin