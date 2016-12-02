React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'
ENTER = 'Enter'

AsyncButton = require '../buttons/async-button'

ConfirmJoinCourse = React.createClass

  propTypes:
    courseEnrollmentActions: React.PropTypes.object.isRequired
    courseEnrollmentStore: React.PropTypes.object.isRequired
    errorList: React.PropTypes.element.isRequired
    optionalStudentId: React.PropTypes.bool

  onKeyPress: (ev) ->
    @onSubmit() if ev.key is ENTER

  onCancel: (ev) ->
    ev.preventDefault()
    @props.courseEnrollmentActions.confirm(@props.courseEnrollmentStore.getEnrollmentChangeId())

  onSubmit: ->
    @props.courseEnrollmentActions.confirm(
      @props.courseEnrollmentStore.getEnrollmentChangeId(), @getSchoolId()
    )

  getSchoolId: -> ReactDOM.findDOMNode(@refs.input).value

  render: ->

    <BS.Row>
      <div className="confirm-join form-group">

        <h3 className="title text-center">
          <div className="join">You are joining</div>
          <div className="course">{@props.courseEnrollmentStore.description()}</div>
          <div className="teacher">{@props.courseEnrollmentStore.teacherNames()}</div>
        </h3>

        {@props.errorList}

        <p className="label">Enter your school-issued ID</p>
        <div className='controls'>
          <div className='field'>

            <input type="text" className="form-control" ref="input"
              autoFocus
              defaultValue={@props.courseEnrollmentStore.getStudentIdentifier()}
              onKeyPress={@onKeyPress}
            />

            <AsyncButton
              className="btn btn-success continue"
              isWaiting={!!@props.courseEnrollmentStore.isBusy}
              waitingText={'Confirming…'}
              onClick={@onSubmit}
            >
              Continue
            </AsyncButton>

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


module.exports = ConfirmJoinCourse
