React = require 'react'

NewCourseRegistration = require './new-registration'
ModifyCourseRegistration = require './modify-registration'
EnrollOrLogin = require './enroll-or-login'

UserStatus = require '../user/status-mixin'
Course = require './model'

CourseRegistration = React.createClass

  propTypes:
    collectionUUID: React.PropTypes.string.isRequired

  mixins: [UserStatus]

  render: ->
    user = @getUser()
    course = user.getCourse(@props.collectionUUID)
    body = if course and course.isRegistered()
      <ModifyCourseRegistration {...@props} course={course} />
    else if user.isLoggedIn()
      <NewCourseRegistration {...@props} />
    else
      <EnrollOrLogin {...@props} />

    <div className="row">
      {body}
    </div>

module.exports = CourseRegistration
