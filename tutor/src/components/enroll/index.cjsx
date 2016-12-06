React = require 'react'
_ = require 'underscore'
{Promise} = require 'es6-promise'

{CourseEnrollmentActions, CourseEnrollmentStore} = require '../../flux/course-enrollment'
{CourseActions, CourseStore} = require '../../flux/course'
ENTER = 'Enter'

ConfirmJoin = require './confirm-join'
Router = require '../../helpers/router'

{ErrorList} = require 'shared'

Enroll = React.createClass

  contextTypes:
    router: React.PropTypes.object

  componentWillMount: ->
    {enrollmentCode} = Router.currentParams()
    CourseEnrollmentStore.on('changed', @onCourseEnrollmentChange)
    CourseEnrollmentActions.create(enrollmentCode)

  componentWillUnmount: ->
    CourseEnrollmentStore.off('changed', @onCourseEnrollmentChange)

  redirectToDashboard: ->
    @context.router.transitionTo(
      Router.makePathname('dashboard', {courseId: CourseEnrollmentStore.getCourseId()})
    )

  # Wait for the course to load and wait at least 1.5 secs
  # so our success message is briefly displayed, then redirect to dashboard
  onComplete: ->
    loadCourse = new Promise((resolve, reject) ->
      CourseStore.once('course.loaded', resolve)
      CourseActions.load(CourseEnrollmentStore.getCourseId())
    )
    successTimer = new Promise((resolve, reject) -> _.delay(resolve, 1500))
    Promise.all([loadCourse, successTimer]).then(@redirectToDashboard)

  onCourseEnrollmentChange: ->
    @onComplete() if CourseEnrollmentStore.isRegistered()
    @forceUpdate()

  renderComplete: ->
    <h3 className="text-center">
      You have successfully joined {CourseEnrollmentStore.description()}
    </h3>

  isTeacher: ->
    CourseStore.isTeacher(CourseEnrollmentStore.courseId)

  renderCurrentStep: ->
    if CourseEnrollmentStore.isLoading()
      <h3>Loading...</h3>
    else if CourseEnrollmentStore.isPending() or CourseEnrollmentStore.isApproveError()
      <ConfirmJoin />
    else if CourseEnrollmentStore.isCreateError()
      <ErrorList errorMessages={CourseEnrollmentStore.errorMessages()} />
    else
      @renderComplete()

  teacherMessage: ->
    <div className="teacher-message">
      <p className="lead">
        Welcome!
      </p><p className="lead">
        To see the student view of your course in Tutor,
        enter an enrollment code from one of your sections.
      </p><p>
        We suggest creating a test section for yourself so you can
        separate your Tutor responses from those of your students.
      </p>
    </div>

  render: ->
    <div className="tutor-registration">
      <div className="row">
        <div className="new-registration">
          {@teacherMessage() if @isTeacher()}
          {@renderCurrentStep()}
        </div>
      </div>
    </div>

module.exports = Enroll
