React = require 'react'
_ = require 'underscore'

Course = require './model'
ENTER = 'Enter'

EnrollOrLogin = require './enroll-or-login'
EnrollmentCodeInput = require './enrollment-code-input'
ConfirmJoin = require './confirm-join'
JoinConflict = require './join-conflict'
Navigation = require '../navigation/model'
User = require '../user/model'
{getCourse} = require '../user/status-mixin'
LaptopAndMug = require '../graphics/laptop-and-mug'


NewCourseRegistration = React.createClass

  propTypes:
    collectionUUID: React.PropTypes.string.isRequired
    validateOnly: React.PropTypes.bool
    course: React.PropTypes.instanceOf(Course)

  contextTypes:
    enrollmentCode: React.PropTypes.string

  getInitialState: ->
    course: getCourse.call(@)
    isAutoRegistering: false

  componentWillMount: ->
    @state.course.channel.on('change', @onCourseChange)
    @registerIfReady()

  componentWillUnmount: ->
    @state.course.channel.off('change', @onCourseChange)

  registerIfReady: ->
    {course} = @state

    if User.isLoggedIn() and
      @props.enrollmentCode and
      not course.isPending() and
      not course.isRegistered() and
      not course.isSecondSemester()
        course.register(@props.enrollmentCode, User)
        @setState(isAutoRegistering: true)

  onComplete: (changeEvent) ->
    @state.course.persist(User, changeEvent)
    Navigation.channel.emit('show')

  onCourseChange: (changeEvent) ->
    if @state.course.isRegistered()
      # wait 1.5 secs so our success message is briefly displayed, then call onComplete.
      # call on complete with change event so that it passes it on so that the base view will
      # update based on being just confirmed.
      _.delay(_.partial(@onComplete, changeEvent), 1500)
    else if @state.course.isValidated()
      @onComplete()
    else if @state.course.isPending()
      _.delay( =>
        @setState(isAutoRegistering: false)
      , 1000)

    @forceUpdate()

  renderValidated: ->
    <p className="lead">Redirecting to login...</p>

  renderComplete: (course) ->
    <div>
      <h3 className="text-center">
        You have successfully joined {course.description()}
      </h3>
      <p>We are loading your first exercise.</p>
    </div>

  isTeacher: ->
    User.isTeacherForCourse(@props.collectionUUID)

  renderCurrentStep: ->
    {course, isAutoRegistering} = @state
    if course.isValidated()
      @renderValidated()
    else if isAutoRegistering
      <div>
        <h3>Please wait while we enroll you in this course.</h3>
        <LaptopAndMug height=400 />
      </div>
    else if course.isPending()
      <ConfirmJoin course={course} />
    else if course.isIncomplete()
      <EnrollmentCodeInput
        isTeacher={!!@isTeacher()}
        secondSemester={@props.secondSemester}
        course={course}
        currentCourses={User.registeredCourses()}
      />
    else if course.isConflicting()
      <JoinConflict course={course} />
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
