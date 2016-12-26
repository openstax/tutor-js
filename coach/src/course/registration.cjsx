React = require 'react'

NewCourseRegistration = require './new-registration'
ModifyCourseRegistration = require './modify-registration'
EnrollOrLogin = require './enroll-or-login'

UserStatusMixin = require '../user/status-mixin'
Course = require './model'

CourseRegistration = React.createClass

  propTypes:
    collectionUUID: React.PropTypes.string.isRequired

  mixins: [UserStatusMixin]

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
