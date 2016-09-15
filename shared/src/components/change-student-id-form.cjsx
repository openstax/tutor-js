React = require 'react'
BS = require 'react-bootstrap'
AsyncButton = require './buttons/async-button'
ENTER = 'Enter'

module.exports = React.createClass

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

  handleChange: ->
    @setState({studentId: @refs.input.getValue()})

  onKeyPress: (ev) ->
    @onSubmit() if ev.key is ENTER

  onCancel: (ev) ->
    ev.preventDefault()
    @props.onCancel()

  onSubmit: ->
    @props.onSubmit(@refs.input.getValue())

  render: ->
    button =
      <AsyncButton
        bsStyle="primary"
        className="btn btn-success"
        isWaiting={!!@props.isBusy}
        waitingText={'Confirming…'}
        onClick={@onSubmit}
      >{@props.saveButtonLabel}</AsyncButton>

    <div className="openstax-change-student-id-form form-group">
      <h3 className="text-center">
        {@props.title}
      </h3>
      {@props.children}
      <div className='panels'>
        <div className='field'>
          <BS.Input type="text" ref="input" label={@props.label}
            placeholder="School issued ID" autoFocus
            value={@state.studentId}
            onChange={@handleChange}
            onKeyPress={@onKeyPress}
            buttonAfter={button} />
        </div>
        <div className="cancel">
          <a href='#' onClick={@onCancel}>Cancel</a>
        </div>
      </div>
    </div>
