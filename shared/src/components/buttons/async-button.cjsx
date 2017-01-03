React = require 'react'
BS = require 'react-bootstrap'
delay = require 'lodash/delay'

OXLink = require '../../factories/link'

RefreshButton = require './refresh-button'

module.exports = React.createClass
  displayName: 'AsyncButton'

  propTypes:
    isWaiting: React.PropTypes.bool.isRequired
    isDone: React.PropTypes.bool
    isFailed: React.PropTypes.bool
    waitingText: React.PropTypes.node # TODO: This should be a Component or array
    failedState: React.PropTypes.func
    failedProps: React.PropTypes.object
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

  componentWillUnmount: ->
    @clearDelay() # make sure any pending timeouts are removed

  componentDidUpdate: ->
    {isWaiting, isJob} = @props
    {isTimedout, delayTimeout} = @state

    if not delayTimeout and isWaiting and not isTimedout
      timeout = @props.timeoutLength or if isJob then 600000 else 30000
      delayTimeout = delay @checkForTimeout, timeout
      @setState({delayTimeout})

  checkForTimeout: ->
    {isWaiting} = @props
    @setState(isTimedout: true, delayTimeout: null) if isWaiting

  clearDelay: ->
    {delayTimeout} = @state
    clearTimeout(delayTimeout) if delayTimeout

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
    {children, waitingText, failedProps, doneText} = @props
    {isTimedout} = @state
    # needs to be capitalized so JSX will transpile as a variable, not element
    FailedState = @props.failedState

    buttonTypeClass = 'async-button'

    if isFailed or isTimedout
      stateClass = 'is-failed'
      return <FailedState {...failedProps} />
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

    <BS.Button {...OXLink.filterProps(@props, prefixes: 'bs')}
      className={[buttonTypeClass, stateClass, className]}
      disabled={disabled}
      >
        {spinner}
        {text}
    </BS.Button>
