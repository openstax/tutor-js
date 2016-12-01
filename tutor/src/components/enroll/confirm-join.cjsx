React = require 'react'

CourseEnrollment = require './course-enrollment'
ErrorList = require './error-list'
{ConfirmJoinCourse} = require 'shared'

ConfirmJoin = React.createClass

  propTypes:
    courseEnrollment: React.PropTypes.instanceOf(CourseEnrollment).isRequired
    optionalStudentId: React.PropTypes.bool

  render: ->
    <ConfirmJoinCourse
      course={@props.courseEnrollment}
      errorList={<ErrorList course={@props.courseEnrollment} />}
      optionalStudentId={@props.optionalStudentId}
    />


module.exports = ConfirmJoin
