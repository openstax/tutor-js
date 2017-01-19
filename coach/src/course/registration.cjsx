React = require 'react'
pick = require 'lodash/pick'

NewCourseRegistration = require './new-registration'
ModifyCourseRegistration = require './modify-registration'
EnrollOrLogin = require './enroll-or-login'

UserStatusMixin = require '../user/status-mixin'
{NotificationActions} = require 'shared'
Course = require './model'

CourseRegistration = React.createClass

  propTypes:
    collectionUUID: React.PropTypes.string.isRequired
    secondSemester: React.PropTypes.bool

  mixins: [UserStatusMixin]

  getInitialState: ->
    courseOptions = pick('secondSemester', @props)
    course: new Course(@props.collectionUUID, @props.enrollmentCode, courseOptions)

  componentWillMount: ->
    NotificationActions.hide(id: 'missing_student_id')
    NotificationActions.hide(id: 'course_has_ended') if @props.secondSemester

  componentWillUnmount: ->
    NotificationActions.unhide(id: 'course_has_ended')
    NotificationActions.unhide(id: 'missing_student_id')

  render: ->
    user = @getUser()

    body = if user.isLoggedIn()
      <NewCourseRegistration {...@props} course={@state.course}/>
    else
      <EnrollOrLogin {...@props} course={@state.course}/>

    <div className="row">
      {body}
    </div>

module.exports = CourseRegistration
