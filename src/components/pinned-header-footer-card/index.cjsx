React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
camelCase = require 'camelcase'

{ScrollListenerMixin} = require 'react-scroll-components'

{PinnedHeader, CardBody, PinnableFooter} = require './sections'

module.exports = React.createClass
  displayName: 'PinnedHeaderFooterCard'
  propTypes:
    buffer: React.PropTypes.number

  getDefaultProps: ->
    buffer: 60
    scrollSpeedBuffer: 10

  getInitialState: ->
    pinned: false

  mixins: [ScrollListenerMixin]

  componentWillMount: ->
    cardBodyClass = @props.cardType
    @documentBodyClass = 'pinned-view'

    document.body.className = "#{cardBodyClass}-view"
    document.body.classList.add(@documentBodyClass)

  componentWillUnmount: ->
    document.body.classList.remove(@documentBodyClass)

  isScrollingSlowed: (prevScrollTop, currentScrollTop) ->
    Math.abs(prevScrollTop - currentScrollTop) <= @props.scrollSpeedBuffer

  isScrollingUp: (prevScrollTop, currentScrollTop) ->
    currentScrollTop < prevScrollTop

  isScrollingDown: (prevScrollTop, currentScrollTop) ->
    currentScrollTop > prevScrollTop

  shouldPinHeader: (prevScrollTop, currentScrollTop) ->
    if @isScrollingDown(prevScrollTop, currentScrollTop)
      # on down scroll, check if the scroll position is past buffer
      shouldPinHeader = (currentScrollTop > @props.buffer)
    # if upscrolling is slow
    else if @isScrollingSlowed(prevScrollTop, currentScrollTop)
      # keep as current pinned state
      shouldPinHeader = @state.pinned
    else if @isScrollingUp(prevScrollTop, currentScrollTop)
      # unpinned on upscroll
      shouldPinHeader = false

    shouldPinHeader

  shouldComponentUpdate: (nextProps, nextState) ->
    # ignore scrolling state changes when checking should component update
    stateNoScroll = _.omit(@state, 'isScrolling', 'scrollTop')
    nextStateNoScroll = _.omit(nextState, 'isScrolling', 'scrollTop')

    # manually check if pinned will change
    didShouldPinChange = not @state.pinned is @shouldPinHeader(@state.scrollTop, nextState.scrollTop)
    # check props and non-scroll states
    didPropsUpdate = not _.isEqual(@props, nextProps)
    didStateUpdate = not _.isEqual(stateNoScroll, nextStateNoScroll)

    # component should only update if pin state will change and non-scroll props or state will change
    # this is to bypass the component trying to update at every frame the user is scrolling
    didShouldPinChange or didPropsUpdate or didStateUpdate

  componentDidUpdate: (prevProps, prevState) ->
    addOrRemove = [
      'remove' # remove class if shouldPinHeader is false
      'add' # add class if shouldPinHeader is true
    ]
    # set the pinned state
    @setState(pinned : @shouldPinHeader(prevState.scrollTop, @state.scrollTop))
    shouldPinHeader = @state.pinned * 1
    classAction = addOrRemove[shouldPinHeader]
    document.body.classList[classAction]('pinned-on')

  render: ->
    {className} = @props
    childrenProps = _.omit(@props, 'children', 'header', 'footer', 'className')

    <div className={className}>
      <PinnedHeader {...childrenProps}>
        {@props.header}
      </PinnedHeader>
      {@props.children}
    </div>
