React = require 'react'
omit = require 'lodash/omit'

NewCourseRegistration = require './new-registration'
ModifyCourseRegistration = require './modify-registration'
EnrollOrLogin = require './enroll-or-login'

UserStatusMixin = require '../user/status-mixin'
{NotificationActions} = require 'shared'

CourseRegistration = React.createClass

  propTypes:
    collectionUUID: React.PropTypes.string.isRequired
    secondSemester: React.PropTypes.bool

  mixins: [UserStatusMixin]

  componentWillMount: ->
    if @props.secondSemester
      # this logic can be moved to user model once it's confirmed whether or not the second semester
      # version needs all of the info.
      semesterClone = omit(@getUser().getCourse(@props.collectionUUID, @props.enrollmentCode), 'to', 'name', 'roles')
      semesterClone.secondSemester = true

      # attach a new course as opposed to mutating the one we are currently enrolled in
      # so that we can go back to progress if needed.
      @getUser().findOrCreateCourse(@props.collectionUUID, @props.enrollmentCode,
        semesterClone
      )

      # should always hide bar when this is mounted regardless of where it's triggered from.
      NotificationActions.acknowledge(id: 'course_has_ended')

  render: ->
    user = @getUser()

    body = if user.isLoggedIn()
      <NewCourseRegistration {...@props} />
    else
      <EnrollOrLogin {...@props} />

    <div className="row">
      {body}
    </div>

module.exports = CourseRegistration
