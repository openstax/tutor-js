React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

RefreshButton = require './refresh-button'

module.exports = React.createClass
  displayName: 'AsyncButton'

  propTypes:
    isWaiting: React.PropTypes.bool.isRequired
    isDone: React.PropTypes.bool
    isFailed: React.PropTypes.bool
    waitingText: React.PropTypes.node # TODO: This should be a Component or array
    failedState: React.PropTypes.element
    doneText: React.PropTypes.node
    isJob: React.PropTypes.bool
    timeoutLength: React.PropTypes.number

  getInitialState: ->
    isTimedout: false
    delayTimeout: null

  componentWillReceiveProps: (nextProps) ->
    if @props.isWaiting isnt nextProps.isWaiting
      @clearDelay() unless nextProps.isWaiting
      @setState(delayTimeout: null)

  componentDidUpdate: ->
    {isWaiting, isJob} = @props
    {isTimedout, delayTimeout} = @state

    if not delayTimeout and isWaiting and not isTimedout
      timeout = @props.timeoutLength or if isJob then 600000 else 30000
      delayTimeout = _.delay @checkForTimeout, timeout
      @setState({delayTimeout})

  checkForTimeout: ->
    {isWaiting} = @props
    @setState(isTimedout: true, delayTimeout: null) if isWaiting and @isMounted()

  clearDelay: ->
    {delayTimeout} = @state
    clearTimeout(delayTimeout)

  getDefaultProps: ->
    isDone: false
    isFailed: false
    waitingText: 'Loading…'
    failedState: <RefreshButton beforeText='There was a problem.  '/>
    doneText: ''
    isJob: false

  render: ->
    {className, disabled} = @props
    {isWaiting, isDone, isFailed} = @props
    {children, waitingText, failedState, doneText} = @props
    {isTimedout} = @state

    buttonTypeClass = 'async-button'

    if isFailed or isTimedout
      stateClass = 'is-failed'
      return failedState
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
