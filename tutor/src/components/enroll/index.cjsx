React = require 'react'
_ = require 'underscore'

{CourseEnrollmentActions, CourseEnrollmentStore} = require '../../flux/course-enrollment'
{CourseStore} = require '../../flux/course'
ENTER = 'Enter'

ConfirmJoin = require './confirm-join'
Router = require '../../helpers/router'

Enroll = React.createClass

  contextTypes:
    router: React.PropTypes.object

  componentWillMount: ->
    {enrollmentCode} = Router.currentParams()
    CourseEnrollmentStore.on('changed', @onCourseEnrollmentChange)
    CourseEnrollmentActions.create(enrollmentCode)

  componentWillUnmount: ->
    CourseEnrollmentStore.off('changed', @onCourseEnrollmentChange)

  onComplete: ->
    @context.router.transitionTo('viewStudentDashboard', CourseEnrollmentStore.courseId())

  onCourseEnrollmentChange: ->
    if CourseEnrollmentStore.isRegistered()
      # wait 1.5 secs so our success message is briefly displayed, then call onComplete
      _.delay(@onComplete, 1500)

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
    else if CourseEnrollmentStore.isPending()
      <ConfirmJoin />
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
    <div className="new-registration">
      {@teacherMessage() if @isTeacher()}
      {@renderCurrentStep()}
    </div>

module.exports = Enroll
