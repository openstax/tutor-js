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
    fixedOffset: React.PropTypes.number

  getDefaultProps: ->
    buffer: 60
    scrollSpeedBuffer: 30
    forceShy: false

  getInitialState: ->
    offset: 0
    shy: false
    pinned: false
    shouldBeShy: false

  mixins: [ScrollListenerMixin]

  componentWillMount: ->
    cardBodyClass = @props.cardType
    @documentBodyClass = 'pinned-view'

    document.body.className = "#{cardBodyClass}-view"
    document.body.classList.add(@documentBodyClass)
    document.body.classList.add('pinned-force-shy') if @props.forceShy

  componentWillUnmount: ->
    document.body.classList.remove(@documentBodyClass)

  getPosition: (el) -> el.getBoundingClientRect().top - document.body.getBoundingClientRect().top

  getOffset: ->
    if @props.fixedOffset?
      offset = @props.fixedOffset
    else
      offset = @getPosition(@refs.header.getDOMNode())

    offset

  setOffset: ->
    offset = @getOffset()
    @setState(offset: offset)

  shouldPinHeader: (prevScrollTop, currentScrollTop) ->
    currentScrollTop >= @state.offset

  isScrollingSlowed: (prevScrollTop, currentScrollTop) ->
    Math.abs(prevScrollTop - currentScrollTop) <= @props.scrollSpeedBuffer

  isScrollingDown: (prevScrollTop, currentScrollTop) ->
    currentScrollTop > prevScrollTop

  isScrollPassBuffer: (prevScrollTop, currentScrollTop) ->
    currentScrollTop >= @props.buffer + @state.offset

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
      # allow shouldBeShy override if needed
      shy: @state.shouldBeShy or @shouldBeShy(prevScrollTop, @state.scrollTop)
      pinned: @shouldPinHeader(prevScrollTop, @state.scrollTop)
      # reset shouldBeShy
      shouldBeShy: false
    )
    shouldPinHeader = @state.pinned * 1
    shouldBeShy = @state.shy * 1

    pinnedClassAction = addOrRemove[shouldPinHeader]
    document.body.classList[pinnedClassAction]('pinned-on')

    shyClassAction = addOrRemove[shouldBeShy]
    document.body.classList[shyClassAction]('pinned-shy')

  forceShy: ->
    window.scroll(0, @props.buffer + @state.offset)
    @setState(shouldBeShy: true)

  componentDidMount: ->
    @setOffset()
    @updatePinState(0)

  componentDidUpdate: (prevProps, prevState) ->
    didOffsetChange = (not @state.pinned) and not (@state.offset is @getOffset())
    didShouldPinChange = not prevState.pinned is @shouldPinHeader(prevState.scrollTop, @state.scrollTop)
    didShouldBeShyChange = not prevState.shy is @shouldBeShy(prevState.scrollTop, @state.scrollTop)

    @setOffset() if didOffsetChange
    @updatePinState(prevState.scrollTop) if didShouldPinChange or didShouldBeShyChange

  componentWillReceiveProps: ->
    @forceShy() if @props.forceShy

  render: ->
    {className} = @props

    classes = ['pinned-container']
    classes.push(className) if className?
    classes = classes.join(' ')

    childrenProps = _.omit(@props, 'children', 'header', 'footer', 'className')

    <div className={classes}>
      <PinnedHeader {...childrenProps} ref='header'>
        {@props.header}
      </PinnedHeader>
      {@props.children}
    </div>
