React = require 'react'
BS = require 'react-bootstrap'
ENTER = 'Enter'

AsyncButton = require '../buttons/async-button'
MessageList = require './message-list'

CcJoinConflict = React.createClass

  propTypes:
    courseEnrollmentStore: React.PropTypes.shape(
      isBusy: React.PropTypes.bool
      description: React.PropTypes.func.isRequired
      teacherNames: React.PropTypes.func.isRequired
      conflictDescription: React.PropTypes.func.isRequired
      conflictTeacherNames: React.PropTypes.func.isRequired
    ).isRequired
    courseEnrollmentActions: React.PropTypes.shape(
      conflictContinue: React.PropTypes.func.isRequired
    ).isRequired

  onKeyPress: (ev) ->
    @onSubmit() if ev.key is ENTER

  onSubmit: ->
    @props.courseEnrollmentActions.conflictContinue()

  getConflictMessage: ->
    'You are already enrolled in another OpenStax Concept Coach using this textbook, ' +
    "#{@props.courseEnrollmentStore.conflictDescription()} with " +
    "#{@props.courseEnrollmentStore.conflictTeacherNames()}. To make sure you don't lose work, " +
    'we strongly recommend enrolling in only one Concept Coach per textbook. When you join the ' +
    'new course below, we will remove you from the other course.'

  render: ->

    <BS.Row>
      <div className="conflict form-group">

        <MessageList messages={[@getConflictMessage()]} />

        <h3 className="title text-center no-border">
          <div className="join">You are joining</div>
          <div className="course">{@props.courseEnrollmentStore.description()}</div>
          <div className="teacher">{@props.courseEnrollmentStore.teacherNames()}</div>
        </h3>

        <AsyncButton
          className="btn btn-success continue"
          isWaiting={!!@props.courseEnrollmentStore.isBusy}
          waitingText={'Confirming…'}
          onClick={@onSubmit}
        >
          Continue
        </AsyncButton>

        <div className="help-text">
          Still want to enroll in both courses?

          <a href='http://openstax.force.com/support/?cu=1&fs=ContactUs&l=en_US&c=Products%3AConcept_Coach&q=ddd'>
            Contact us.
          </a>
        </div>
      </div>
    </BS.Row>


module.exports = CcJoinConflict
