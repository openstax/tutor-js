React = require 'react'
_ = require 'underscore'

Course = require './model'
ENTER = 'Enter'

EnrollmentCodeInput = require './enrollment-code-input'
ConfirmJoin = require './confirm-join'
JoinConflict = require './join-conflict'
Navigation = require '../navigation/model'
User = require '../user/model'

NewCourseRegistration = React.createClass

  propTypes:
    collectionUUID: React.PropTypes.string.isRequired
    validateOnly: React.PropTypes.bool
    course: React.PropTypes.instanceOf(Course)

  contextTypes:
    enrollmentCode: React.PropTypes.string


  componentWillMount: ->
    course = @props.course or
      User.getCourse(@props.collectionUUID) or
      new Course({ecosystem_book_uuid: @props.collectionUUID})
    if @props.secondSemester
      course.prepForSecondSemesterEnrollment()
    @registerIfReady(course)
    course.channel.on('change', @onCourseChange)
    @setState({course})

  componentWillUnmount: ->
    @state.course.channel.off('change', @onCourseChange)

  registerIfReady: (course) ->
    if User.isLoggedIn() and @props.enrollmentCode and not course.isRegistered()
      course.register(@props.enrollmentCode, User)

  onComplete: ->
    @state.course.persist(User)
    Navigation.channel.emit('show')

  onCourseChange: ->
    if @state.course.isRegistered()
      # wait 1.5 secs so our success message is briefly displayed, then call onComplete
      _.delay(@onComplete, 1500)
    else if @state.course.isValidated()
      @onComplete()

    @forceUpdate()

  renderValidated: ->
    <p className="lead">Redirecting to login...</p>

  renderComplete: (course) ->
    <h3 className="text-center">
      You have successfully joined {course.description()}
    </h3>

  isTeacher: ->
    User.isTeacherForCourse(@props.collectionUUID)

  renderCurrentStep: ->
    {course} = @state
    if course.isValidated()
      @renderValidated()
    else if course.isIncomplete()
      <EnrollmentCodeInput
        isTeacher={!!@isTeacher()}
        secondSemester={@props.secondSemester}
        course={course}
        currentCourses={User.registeredCourses()}
      />
    else if course.isConflicting()
      <JoinConflict course={course} />
    else if course.isPending()
      <ConfirmJoin course={course} />
    else
      @renderComplete(course)

  teacherMessage: ->
    <div className="teacher-message">
      <p className="lead">
        Welcome!
      </p><p className="lead">
        To see the student view of your course in Concept Coach,
        enter an enrollment code from one of your sections.
      </p><p>
        We suggest creating a test section for yourself so you can
        separate your Concept Coach responses from those of your students.
      </p>
    </div>

  render: ->
    <div className="new-registration">
      {@teacherMessage() if @isTeacher()}
      {@renderCurrentStep()}
    </div>

module.exports = NewCourseRegistration
