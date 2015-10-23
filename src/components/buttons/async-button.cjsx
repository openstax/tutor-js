React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

RefreshButton = require './refresh-button'

module.exports = React.createClass
  displayName: 'AsyncButton'

  getInitialState: ->
    isTimedout: false

  componentDidUpdate: ->
    {isWaiting, isJob} = @props
    {isTimedout} = @state

    timeout = if isJob then 600000 else 30000

    if isWaiting and not isTimedout
      _.delay =>
        @checkForTimeout()
      , timeout

  checkForTimeout: ->
    {isWaiting} = @props
    @setState(isTimedout: true) if isWaiting

  propTypes:
    isWaiting: React.PropTypes.bool.isRequired
    isDone: React.PropTypes.bool
    isFailed: React.PropTypes.bool
    waitingText: React.PropTypes.node # TODO: This should be a Component or array
    failedState: React.PropTypes.func
    failedProps: React.PropTypes.object
    doneText: React.PropTypes.node
    isJob: React.PropTypes.bool

  getDefaultProps: ->
    isDone: false
    isFailed: false
    waitingText: 'Loading…'
    failedState: RefreshButton
    failedProps:
      beforeText: 'There was a problem.  '
    doneText: ''
    isJob: false

  render: ->
    {className, disabled} = @props
    {isWaiting, isDone, isFailed} = @props
    {children, waitingText, failedState, failedProps, doneText} = @props
    {isTimedout} = @state

    buttonTypeClass = 'async-button'

    if isFailed or isTimedout
      stateClass = 'is-failed'
      return <failedState {...failedProps}/>
    else if isWaiting
      stateClass = 'is-waiting'
      text = waitingText
      disabled = true
      spinner = <i className='fa fa-spinner fa-spin'/>
    else if isDone
      stateClass = 'is-done'
      text = doneText
    else
      stateClass = null
      text = children

    <BS.Button {...@props}
      className={[buttonTypeClass, stateClass, className]}
      disabled={disabled}
      >
        {spinner}
        {text}
    </BS.Button>
