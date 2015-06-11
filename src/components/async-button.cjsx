React = require 'react'
BS = require 'react-bootstrap'
RefreshButton = require './refresh-button'

module.exports = React.createClass
  displayName: 'AsyncButton'

  propTypes:
    isWaiting: React.PropTypes.bool.isRequired
    isDone: React.PropTypes.bool
    isFailed: React.PropTypes.bool
    waitingText: React.PropTypes.any # TODO: This should be a Component or array
    failedState: React.PropTypes.func
    failedProps: React.PropTypes.object
    doneText: React.PropTypes.any

  getDefaultProps: ->
    isDone: false
    isFailed: false
    waitingText: 'Loading…'
    failedState: RefreshButton
    failedProps:
      beforeText: 'There was a problem.  '
    doneText: ''

  render: ->
    {className, disabled} = @props
    {isWaiting, isDone, isFailed} = @props
    {children, waitingText, failedState, failedProps, doneText} = @props

    if isFailed
      stateClass = 'is-error'
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
      className={[stateClass, className]}
      disabled={disabled}
      >
        {spinner}
        {text}
    </BS.Button>
