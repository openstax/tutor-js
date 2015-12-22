React = require 'react'

NewCourseRegistration = require './new-registration'
ModifyCourseRegistration = require './modify-registration'

UserStatus = require '../user/status-mixin'
Course = require './model'

CourseRegistration = React.createClass

  propTypes:
    collectionUUID: React.PropTypes.string.isRequired
    validateOnly: React.PropTypes.bool

  mixins: [UserStatus]

  render: ->
    course = @getUser().getCourse(@props.collectionUUID)
    body = if course and not @props.validateOnly
      <ModifyCourseRegistration {...@props} course={course} />
    else
      <NewCourseRegistration {...@props} validateOnly={@props.validateOnly} />

    <div className="row">
      {body}
    </div>

module.exports = CourseRegistration
