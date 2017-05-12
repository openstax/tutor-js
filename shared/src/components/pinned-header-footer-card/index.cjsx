React = require 'react'
ReactDOM = require 'react-dom'
classnames = require 'classnames'

omit  = require 'lodash/omit'

ScrollListenerMixin = require '../../mixins/ScrollListener'

ResizeListenerMixin = require '../resize-listener-mixin'
GetPositionMixin = require '../get-position-mixin'
HandleBodyClassesMixin = require '../handle-body-classes-mixin'

{PinnedHeader, CardBody, PinnableFooter} = require './sections'

module.exports = React.createClass
  displayName: 'PinnedHeaderFooterCard'
  propTypes:
    cardType: React.PropTypes.string.isRequired
    buffer: React.PropTypes.number
    scrollSpeedBuffer: React.PropTypes.number
    forceShy: React.PropTypes.bool
    containerBuffer: React.PropTypes.number

  getDefaultProps: ->
    buffer: 60
    scrollSpeedBuffer: 30
    forceShy: false
    containerBuffer: 30

  getInitialState: ->
    offset: 0
    shy: false
    pinned: false
    shouldBeShy: false
    headerHeight: 0
    containerMarginTop: '0px'

  mixins: [ScrollListenerMixin, ResizeListenerMixin, GetPositionMixin, HandleBodyClassesMixin]

  _getClasses: (props, state) ->
    props ?= @props
    state ?= @state

    "#{props.cardType}-view": true
    'pinned-view': true
    'pinned-force-shy': props.forceShy
    'pinned-on':  state.pinned
    'pinned-shy': state.shy

  componentWillMount: ->
    @setBodyClasses()

  componentWillUnmount: ->
    @unsetBodyClasses()

  getOffset: ->
    if @props.fixedOffset?
      @props.fixedOffset
    else if @refs.header?
      @getTopPosition(ReactDOM.findDOMNode(@refs.header))

  setOffset: ->
    @setState(offset: @getOffset())

  shouldPinHeader: (prevScrollTop, currentScrollTop) ->
    currentScrollTop >= @state.offset - @props.buffer

  isScrollingSlowed: (prevScrollTop, currentScrollTop) ->
    Math.abs(prevScrollTop - currentScrollTop) <= @props.scrollSpeedBuffer

  isScrollingDown: (prevScrollTop, currentScrollTop) ->
    currentScrollTop > prevScrollTop

  isScrollPassBuffer: (prevScrollTop, currentScrollTop) ->
    currentScrollTop >= @props.buffer + @state.offset

  shouldBeShy: (prevScrollTop, currentScrollTop) ->
    # should not pin regardless of scroll direction if the scroll top is above buffer
    unless @isScrollPassBuffer(prevScrollTop, currentScrollTop)
      false

    # otherwise, when scroll top is below buffer
    # and on down scroll
    else if @isScrollingDown(prevScrollTop, currentScrollTop)
      # header should pin
      true

    # or when up scrolling is slow
    else if @isScrollingSlowed(prevScrollTop, currentScrollTop)
      # leave the pinning as is
      @state.shy

    # else, the only case left is if up scrolling is fast
    else
      # unpin on fast up scroll
      false

  unPin: ->
    @setState(pinned: false)

  updatePinState: (prevScrollTop) ->
    nextState = 
      # allow shouldBeShy override if needed
      shy: @state.shouldBeShy or @shouldBeShy(prevScrollTop, @state.scrollTop)
      pinned: @shouldPinHeader(prevScrollTop, @state.scrollTop)
      # reset shouldBeShy
      shouldBeShy: false

    # set the pinned state
    @setState(nextState)
    @setBodyClasses(@props, nextState)

  forceShy: ->
    window.scroll(0, @props.buffer + @state.offset)
    @setState(shouldBeShy: true)

  getHeaderHeight: ->
    header = ReactDOM.findDOMNode(@refs.header)
    headerHeight = header?.offsetHeight or 0

  setOriginalContainerMargin: ->
    container = ReactDOM.findDOMNode(@refs.container)
    return unless container

    @setState(containerMarginTop: window.getComputedStyle(container).marginTop) if window.getComputedStyle?

  setContainerMargin: ->
    headerHeight = @getHeaderHeight()
    container = ReactDOM.findDOMNode(@refs.container)
    return unless container

    @setState(headerHeight: headerHeight)

  _resizeListener: ->
    @setContainerMargin()

  componentDidMount: ->
    @setOffset()
    @updatePinState(0)
    @setOriginalContainerMargin()
    @setContainerMargin()

  componentDidUpdate: (prevProps, prevState) ->
    didOffsetChange = (not @state.pinned) and not (@state.offset is @getOffset())
    didShouldPinChange = not prevState.pinned is @shouldPinHeader(prevState.scrollTop, @state.scrollTop)
    didShouldBeShyChange = not prevState.shy is @shouldBeShy(prevState.scrollTop, @state.scrollTop)
    didHeaderHeightChange = not (prevState.headerHeight is @getHeaderHeight())

    @setOffset() if didOffsetChange
    @updatePinState(prevState.scrollTop) if didShouldPinChange or didShouldBeShyChange
    @setContainerMargin() if didHeaderHeightChange or didShouldPinChange

  componentWillReceiveProps: (nextProps) ->
    @forceShy() if @props.forceShy
    @setBodyClasses()

  render: ->
    {className} = @props
    classes = classnames('pinned-container', className)

    childrenProps = omit(@props, 'children', 'header', 'footer', 'className')

    if @state.pinned
      containerStyle =
        marginTop: (@state.headerHeight + @props.containerBuffer) + 'px'
    else
      containerStyle =
        marginTop: @state.containerMarginTop

    if @props.header?
      pinnedHeader = <PinnedHeader {...childrenProps} ref='header'>
        {@props.header}
      </PinnedHeader>

    <div className={classes} style={containerStyle} ref='container'>
      {pinnedHeader}
      {@props.children}
    </div>
