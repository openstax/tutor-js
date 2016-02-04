React = require 'react'
BS = require 'react-bootstrap'
ENTER = 'Enter'

Course = require './model'
ErrorList = require './error-list'
{AsyncButton} = require 'openstax-react-components'

RequestStudentId = React.createClass

  propTypes:
    onCancel: React.PropTypes.func.isRequired
    onSubmit: React.PropTypes.func.isRequired
    label: React.PropTypes.string.isRequired
    saveButtonLabel: React.PropTypes.string.isRequired
    title: React.PropTypes.string.isRequired
    course: React.PropTypes.instanceOf(Course).isRequired
    optionalStudentId: React.PropTypes.bool

  startConfirmation: ->
    @props.course.confirm(@refs.input.getValue())

  onKeyPress: (ev) ->
    @onSubmit() if ev.key is ENTER

  onSubmit: ->
    @props.onSubmit(@refs.input.getValue())

  renderCancel: ->
    <div className="col-sm-2">
      <button className="btn"
        onClick={@props.onCancel}>Cancel</button>
    </div>

  render: ->
    button =
      <AsyncButton
        className="btn btn-success"
        isWaiting={!!@props.course.isBusy}
        waitingText={'Confirming…'}
        onClick={@onSubmit}
      >{@props.saveButtonLabel}</AsyncButton>

    <div className="form-group">
      <h3 className="text-center">
        {@props.title}
      </h3>
      <ErrorList course={@props.course} />
      <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12">

        <BS.Input type="text" ref="input" label={@props.label}
          placeholder="School issued ID" autoFocus
          onKeyPress={@onKeyPress}
          buttonAfter={button} />

      </div>
        {@renderCancel() if @props.canCancel}
    </div>

module.exports = RequestStudentId
