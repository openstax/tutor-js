React = require 'react'
_ = require 'underscore'

CourseEnrollment = require './course-enrollment'
{CurrentUserActions, CurrentUserStore} = require '../../flux/current-user'
{CourseActions, CourseStore} = require '../../flux/course'
ENTER = 'Enter'

ConfirmJoin = require './confirm-join'
Router = require '../../helpers/router'

Enroll = React.createClass

  propTypes:
    enrollmentCode: React.PropTypes.string.isRequired
    title: React.PropTypes.string
    courseEnrollment: React.PropTypes.instanceOf(CourseEnrollment)

  contextTypes:
    router: React.PropTypes.object

  getDefaultProps: ->
    title: 'Register for this Tutor course'

  componentWillMount: ->
    courseEnrollment = @props.courseEnrollment or new CourseEnrollment(@props.enrollmentCode)
    courseEnrollment.channel.on('change', @onCourseEnrollmentChange)
    @setState({courseEnrollment})

  componentWillUnmount: ->
    @state.courseEnrollment.channel.off('change', @onCourseEnrollmentChange)

  onComplete: ->
    @context.router.transitionTo('dashboard', @props.courseEnrollment.courseId)

  onCourseEnrollmentChange: ->
    if @state.courseEnrollment.isRegistered()
      # wait 1.5 secs so our success message is briefly displayed, then call onComplete
      _.delay(@onComplete, 1500)

    @forceUpdate()

  renderComplete: (courseEnrollment) ->
    <h3 className="text-center">
      You have successfully joined {courseEnrollment.description()}
    </h3>

  isTeacher: ->
    CourseStore.isTeacher(courseEnrollment.courseId)

  renderCurrentStep: ->
    {courseEnrollment} = @state
    if courseEnrollment.isPending()
      <ConfirmJoin course={courseEnrollment} />
    else
      @renderComplete(course)

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
