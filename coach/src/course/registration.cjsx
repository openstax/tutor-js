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
    if @props.secondSemester
      courseOptions =
        secondSemester: true
    course: new Course(@props.collectionUUID, @props.enrollmentCode, courseOptions)

  componentWillMount: ->
    if @props.secondSemester
      # should always hide bar when this is mounted regardless of where it's triggered from.
      NotificationActions.acknowledge(id: 'course_has_ended')

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
