React = require 'react'
BS = require 'react-bootstrap'

module.exports = React.createClass
  displayName: 'AsyncButton'

  propTypes:
    store: React.PropTypes.object.isRequired
    isWaiting: React.PropTypes.bool.isRequired
    isDone: React.PropTypes.bool
    isFailed: React.PropTypes.bool
    waitingText: React.PropTypes.any # TODO: This should be a Component or array
    errorText: React.PropTypes.any
    doneText: React.PropTypes.any

  getDefaultProps: ->
    isDone: false
    isFailed: false
    waitingText: 'Loading…'
    errorText: 'Error. Please refresh'
    doneText: ''

  render: ->
    {className, disabled} = @props
    {isWaiting, isDone, isFailed} = @props
    {children, waitingText, errorText, doneText} = @props

    if isFailed
      # TODO: Turn this into a link that reloads the page
      stateClass = 'is-error'
      text = errorText
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
