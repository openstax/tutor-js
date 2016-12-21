React = require 'react'
BS = require 'react-bootstrap'
isEmpty = require 'lodash/isEmpty'
AsyncButton = require './buttons/async-button'
ENTER = 'Enter'
classnames = require 'classnames'

BlankWarning = (props) ->
  <div
    className={classnames('blank-warning', visible: isEmpty(props.value))}
  >
    An ID is required for credit. You have not yet entered an ID
  </div>

ChangeStudentIdForm = React.createClass

  propTypes:
    onCancel: React.PropTypes.func.isRequired
    onSubmit: React.PropTypes.func.isRequired
    label: React.PropTypes.oneOfType([
      React.PropTypes.string
      React.PropTypes.element
    ]).isRequired
    saveButtonLabel: React.PropTypes.string.isRequired
    title: React.PropTypes.string.isRequired

  getInitialState: -> { studentId: @props.studentId }

  componentWillReceiveProps: (newProps) ->
    @setState({ studentId: newProps.studentId })

  handleChange: (ev) ->
    @setState({studentId: ev.target.value})

  onKeyPress: (ev) ->
    @onSubmit() if ev.key is ENTER

  onCancel: (ev) ->
    ev.preventDefault()
    @props.onCancel()

  onSubmit: ->
    @props.onSubmit(@state.studentId)

  render: ->
    <div className='openstax-change-student-id-form'>
      <h2 className='title'>
        {@props.title}
      </h2>
      {@props.children}
      <div className="controls">
        <div className="main">
          <BS.ControlLabel>{@props.label}</BS.ControlLabel>
          <div className="inputs">
            <input
              autoFocus
              placeholder='School issued ID'
              defaultValue={@state.studentId}
              onChange={@handleChange}
              onKeyPress={@onKeyPress}
            />
            <AsyncButton
              bsStyle="primary"
              className="btn btn-success"
              isWaiting={!!@props.isBusy}
              waitingText={'Confirming…'}
              onClick={@onSubmit}
            >
              {@props.saveButtonLabel}
            </AsyncButton>
          </div>
          <BlankWarning value={@state.studentId} />
        </div>
        <div className="cancel">
          <a href='#' onClick={@onCancel}>Cancel</a>
        </div>
      </div>

      <div className="ask-for-it">
        Don’t have one? Contact your instructor.
      </div>
    </div>

module.exports = ChangeStudentIdForm
