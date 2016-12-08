React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'
ENTER = 'Enter'

AsyncButton = require '../buttons/async-button'
CcConflictMessage = require './cc-conflict-message'
MessageList = require './message-list'

ConfirmJoinCourse = React.createClass

  propTypes:
    courseEnrollmentActions: React.PropTypes.shape(
      confirm: React.PropTypes.func.isRequired
    ).isRequired
    courseEnrollmentStore: React.PropTypes.shape(
      isBusy: React.PropTypes.bool.isRequired
      hasConflict: React.PropTypes.func.isRequired
      description: React.PropTypes.func.isRequired
      teacherNames: React.PropTypes.func.isRequired
      getEnrollmentChangeId: React.PropTypes.func.isRequired
      getStudentIdentifier: React.PropTypes.func.isRequired
      errorMessages: React.PropTypes.func.isRequired
    ).isRequired
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

        {<MessageList
          messages={[<CcConflictMessage courseEnrollmentStore={@props.courseEnrollmentStore}/>]}
          alertType="info"
          messagesType="conflicts"
          /> if @props.courseEnrollmentStore.hasConflict()}

        <MessageList messages={@props.courseEnrollmentStore.errorMessages()} />

        <h3 className="title text-center">
          <div className="join">You are joining</div>
          <div className="course">{@props.courseEnrollmentStore.description()}</div>
          <div className="teacher">{@props.courseEnrollmentStore.teacherNames()}</div>
        </h3>

        <p className="label">Enter your school-issued student ID that is used for grading</p>
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

            <a href='#' className="skip" onClick={@onCancel}>
              Add it later
            </a>
          </div>
          <div className="required">
            Required for credit
          </div>
        </div>
      </div>
    </BS.Row>


module.exports = ConfirmJoinCourse
