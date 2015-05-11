React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
camelCase = require 'camelcase'

{ScrollListenerMixin} = require 'react-scroll-components'

{PinnedHeader, CardBody, PinnedFooter} = require './sections'

module.exports = React.createClass
  displayName: 'PinnedHeaderFooterCard'
  propTypes:
    buffer: React.PropTypes.number

  getDefaultProps: ->
    buffer: 60

  mixins: [ScrollListenerMixin]

  componentWillMount: ->
    cardBodyClass = @props.cardType
    @documentBodyClass = 'pinned-view'

    document.body.className = "#{cardBodyClass}-view"
    document.body.classList.add(@documentBodyClass)

  componentWillUnmount: ->
    document.body.classList.remove(@documentBodyClass)

  shouldPinHeader: (scrollTop) ->
    scrollTop > @props.buffer

  shouldComponentUpdate: (nextProps, nextState) ->
    # ignore scrolling state changes when checking should component update
    stateNoScroll = _.omit(@state, 'isScrolling', 'scrollTop')
    nextStateNoScroll = _.omit(nextState, 'isScrolling', 'scrollTop')

    # manually check if should pin has changed
    didShouldPinChange = not @shouldPinHeader(@state.scrollTop) is @shouldPinHeader(nextState.scrollTop)
    # check props and non-scroll states
    didPropsUpdate = not _.isEqual(@props, nextProps)
    didStateUpdate = not _.isEqual(stateNoScroll, nextStateNoScroll)

    didShouldPinChange or didPropsUpdate or didStateUpdate

  componentDidUpdate: (prevProps, prevState) ->
    addOrRemove = [
      'remove' # remove class if shouldPinHeader is false
      'add' # add class if shouldPinHeader is true
    ]

    shouldPinHeader = @shouldPinHeader(@state.scrollTop) * 1
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
