React = require 'react/addons'
_ = require 'underscore'

{GetPositionMixin} = require 'openstax-react-components'

# A component that accepts a dom selector that matches portions of the document
#
# It listens for scroll events and notifies it's children
# when elements that match the selector are visible in the current viewport
#
# The elements are sorted by what percentage of the screen they occupy
# If they are all equivilent, they're returned in document order
#
# For instance if the current page is made up of vertically stacked '.panels'
# ScrollSpy will calculate which .panels are currently visible and notify it's component
# when the selection changes
ScrollSpy = React.createClass

  getInitialState: -> {}

  getDefaultProps: ->
    windowImpl: window

  propTypes:
    dataSelector: React.PropTypes.string.isRequired

  componentWillMount: ->
    @props.windowImpl.addEventListener('scroll', @onScroll)
    @calculateScroll()

  componentWillUnmount: ->
    @props.windowImpl.removeEventListener('scroll', @onScroll)

  onScroll: _.debounce( ->
    @calculateScroll()
  , 100)

  calculateScroll: ->
    onScreen = []

    height = @props.windowImpl.innerHeight

    elements = @props.windowImpl.document.querySelectorAll("[#{@props.dataSelector}]")

    for el, index in elements
      bounds = el.getBoundingClientRect()
      visibleHeight =
        Math.min(height, bounds.bottom) - Math.max(0, bounds.top)
      if visibleHeight > 0
        key = el.getAttribute(@props.dataSelector)
        # Calculate the percentage of the screen the element occupies
        # 0.01 * index is added to it so that equivalent sized elements will be sorted by
        # the position they occur in
        onScreen.push([key, (visibleHeight / height) - (0.01 * onScreen.length)])

    @setState(
      onScreen: _.pluck( _.sortBy(onScreen, '1').reverse(), '0' )
    )

  render: ->
    React.cloneElement @props.children, onScreenElements: @state.onScreen

module.exports = ScrollSpy
