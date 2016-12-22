React = require 'react'
_ = require 'underscore'
{Promise} = require 'es6-promise'
BindStoreMixin = require '../bind-store-mixin'
Router = require '../../helpers/router'

{CourseEnrollmentActions, CourseEnrollmentStore} = require '../../flux/course-enrollment'
{CourseActions, CourseStore} = require '../../flux/course'
{CourseListingActions, CourseListingStore} = require '../../flux/course-listing'
{MessageList} = require 'shared'

ConfirmJoin = require './confirm-join'
JoinConflict = require './join-conflict'

ENTER = 'Enter'

TeacherMessage = (props) ->
  return null unless props.visible

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

Enroll = React.createClass

  mixins: [BindStoreMixin]

  bindStore: CourseEnrollmentStore

  bindUpdate: ->
    @onComplete() if CourseEnrollmentStore.isRegistered()
    @forceUpdate()

  contextTypes:
    router: React.PropTypes.object

  componentWillMount: ->
    {enrollmentCode} = Router.currentParams()
    CourseEnrollmentActions.create(enrollmentCode)

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
    # On page load of this page, the student is not yet enrolled to this course,
    # so the bootstrapped data that gets loaded into CourseListingStore does not include this new course.
    # We need to make sure we load the full course listing after enrollment, otherwise
    # dashboard will continue to think we're not enrolled in the new course.
    loadCourseListing = new Promise((resolve, reject) ->
      CourseListingStore.once('loaded', resolve)
      CourseListingActions.load()
    )
    successTimer = new Promise((resolve, reject) -> _.delay(resolve, 1500))
    Promise.all([loadCourse, loadCourseListing, successTimer]).then(@redirectToDashboard)

  isTeacher: ->
    CourseStore.isTeacher(CourseEnrollmentStore.courseId)

  renderCurrentStep: ->
    if CourseEnrollmentStore.isLoading()
      <h3>Loading...</h3>
    else if CourseEnrollmentStore.isConflicting()
      <JoinConflict />
    else if CourseEnrollmentStore.isPending() or CourseEnrollmentStore.isRegisterError()
      <ConfirmJoin />
    else if CourseEnrollmentStore.isCreateError()
      <MessageList messages={CourseEnrollmentStore.errorMessages()} />
    else
      <h3 className="text-center">
        You have successfully joined {CourseEnrollmentStore.description()}
      </h3>

  render: ->
    <div className="tutor-registration">
      <div className="row">
        <div className="new-registration">
          <TeacherMessage visible={@isTeacher()} />
          {@renderCurrentStep()}
        </div>
      </div>
    </div>

module.exports = Enroll
