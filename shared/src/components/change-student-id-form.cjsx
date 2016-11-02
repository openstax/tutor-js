React = require 'react'
BS = require 'react-bootstrap'
AsyncButton = require './buttons/async-button'
ENTER = 'Enter'

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

  SubmitButton: ->
    <BS.InputGroup.Button>
      <AsyncButton
        bsStyle="primary"
        className="btn btn-success"
        isWaiting={!!@props.isBusy}
        waitingText={'Confirming…'}
        onClick={@onSubmit}
      >{@props.saveButtonLabel}</AsyncButton>
    </BS.InputGroup.Button>

  render: ->
    <BS.FormGroup className='openstax-change-student-id-form'>
      <h3 className='text-center'>
        {@props.title}
      </h3>
      {@props.children}
      <BS.Col sm={9}>
        <BS.ControlLabel>{@props.label}</BS.ControlLabel>
        <BS.InputGroup>
          <BS.FormControl
            type='text'
            ref='input'
            autoFocus
            placeholder='School issued ID'
            value={@state.studentId}
            onChange={@handleChange}
            onKeyPress={@onKeyPress}
          />
          <BS.InputGroup.Button>
            <@SubmitButton />
          </BS.InputGroup.Button>
        </BS.InputGroup>
      </BS.Col>
      <BS.Col sm={3}>
        <div className='cancel'>
          <a href='#' onClick={@onCancel}>Cancel</a>
        </div>
      </BS.Col>
    </BS.FormGroup>

module.exports = ChangeStudentIdForm
