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
    offset: 0
    buffer: 60
    scrollSpeedBuffer: 30

  getInitialState: ->
    shy: false
    pinned: false

  mixins: [ScrollListenerMixin]

  componentWillMount: ->
    cardBodyClass = @props.cardType
    @documentBodyClass = 'pinned-view'

    document.body.className = "#{cardBodyClass}-view"
    document.body.classList.add(@documentBodyClass)

  componentWillUnmount: ->
    document.body.classList.remove(@documentBodyClass)

  # componentDidMount: ->
  #   headerDOMNode = @refs.header.getDOMNode()
  #   buffer = @getPosition(headerDOMNode)

  #   @setState(buffer: buffer)

  # getPosition: (el) -> el.getBoundingClientRect().top - document.body.getBoundingClientRect().top

  shouldPinHeader: (prevScrollTop, currentScrollTop) ->
    currentScrollTop >= @props.offset

  isScrollingSlowed: (prevScrollTop, currentScrollTop) ->
    Math.abs(prevScrollTop - currentScrollTop) <= @props.scrollSpeedBuffer

  isScrollingUp: (prevScrollTop, currentScrollTop) ->
    currentScrollTop < prevScrollTop

  isScrollingDown: (prevScrollTop, currentScrollTop) ->
    currentScrollTop > prevScrollTop

  isScrollPassBuffer: (prevScrollTop, currentScrollTop) ->
    currentScrollTop > @props.buffer + @props.offset

  shouldBeShy: (prevScrollTop, currentScrollTop) ->
    # should not pin regardless of scroll direction if the scroll top is above buffer
    unless @isScrollPassBuffer(prevScrollTop, currentScrollTop)
      shouldBeShy = false

    # otherwise, when scroll top is below buffer
    # and on down scroll
    else if @isScrollingDown(prevScrollTop, currentScrollTop)
      # header should pin
      shouldBeShy = true

    # or when up scrolling is slow
    else if @isScrollingSlowed(prevScrollTop, currentScrollTop)
      # leave the pinning as is
      shouldBeShy = @state.shy

    # else, the only case left is if up scrolling is fast
    else
      # unpin on fast up scroll
      shouldBeShy = false

    shouldBeShy

  updatePinState: (prevScrollTop) ->
    addOrRemove = [
      'remove' # remove class if shouldPinHeader is false
      'add' # add class if shouldPinHeader is true
    ]
    # set the pinned state
    @setState(
      shy: @shouldBeShy(prevScrollTop, @state.scrollTop)
      pinned : @shouldPinHeader(prevScrollTop, @state.scrollTop)
    )
    shouldPinHeader = @state.pinned * 1
    shouldBeShy = @state.shy * 1

    pinnedClassAction = addOrRemove[shouldPinHeader]
    document.body.classList[pinnedClassAction]('pinned-on')

    shyClassAction = addOrRemove[shouldBeShy]
    document.body.classList[shyClassAction]('pinned-shy')

  shouldComponentUpdate: (nextProps, nextState) ->
    # ignore scrolling state changes when checking should component update
    stateNoScroll = _.omit(@state, 'isScrolling', 'scrollTop')
    nextStateNoScroll = _.omit(nextState, 'isScrolling', 'scrollTop')

    # manually check if pinned will change
    didShouldPinChange = not @state.pinned is @shouldPinHeader(@state.scrollTop, nextState.scrollTop)
    didShouldBeShyChange = not @state.shy is @shouldBeShy(@state.scrollTop, nextState.scrollTop)

    # check props and non-scroll states
    didPropsUpdate = not _.isEqual(@props, nextProps)
    didStateUpdate = not _.isEqual(stateNoScroll, nextStateNoScroll)

    # component should only update if pin state will change and non-scroll props or state will change
    # this is to bypass the component trying to update at every frame the user is scrolling
    didShouldPinChange or didShouldBeShyChange or didPropsUpdate or didStateUpdate

  componentDidMount: ->
    @updatePinState(0)

  componentDidUpdate: (prevProps, prevState) ->
    @updatePinState(prevState.scrollTop)

  render: ->
    {className} = @props
    childrenProps = _.omit(@props, 'children', 'header', 'footer', 'className')

    <div className="pinned-container #{className}">
      <PinnedHeader {...childrenProps} ref='header'>
        {@props.header}
      </PinnedHeader>
      {@props.children}
    </div>
