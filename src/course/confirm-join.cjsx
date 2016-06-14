React = require 'react'
BS = require 'react-bootstrap'
ENTER = 'Enter'
RequestStudentId = require './request-student-id'

Course = require './model'
ErrorList = require './error-list'
{AsyncButton} = require 'openstax-react-components'

ConfirmJoin = React.createClass

  propTypes:
    title: React.PropTypes.element.isRequired
    course: React.PropTypes.instanceOf(Course).isRequired
    optionalStudentId: React.PropTypes.bool

  startConfirmation: ->
    @props.course.confirm(@refs.input.getValue())

  onKeyPress: (ev) ->
    @onSubmit() if ev.key is ENTER

  onCancel: (ev) ->
    ev.preventDefault()
    @props.course.confirm('')

  onSubmit: ->
    @props.course.confirm(@refs.input.getValue())

  render: ->
    button =
      <AsyncButton
        className="btn btn-success"
        isWaiting={!!@props.course.isBusy}
        waitingText={'Confirming…'}
        onClick={@onSubmit}
      >
        Continue
      </AsyncButton>

    <BS.Row>
      <div className="confirm-join form-group">

        <h3 className="title text-center">
          You are joining
          <span className="course">{@props.course.description()}</span>
          <span className="teacher">{@props.course.teacherNames()}</span>
        </h3>

        <ErrorList course={@props.course} />
        <div className='controls'>
          <div className='field'>
            <BS.Input type="text" ref="input" label={@props.label}
              placeholder="School issued ID" autoFocus
              defaultValue={@props.course.getStudentIdentifier()}
              onKeyPress={@onKeyPress}
              buttonAfter={button}
            />
          </div>
          <span className="or">or</span>
          <a href='#' className="skip" onClick={@onCancel}>
            Skip this step for now<sup>*</sup>
          </a>
        </div>
        <div className="help-text">
          <sup>*</sup> You can enter you student ID later by clicking on your name in the top right
          of your dashboard and selecting "Change Student ID" from the menu.
        </div>
      </div>
    </BS.Row>


module.exports = ConfirmJoin
