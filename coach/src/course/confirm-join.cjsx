React = require 'react'

Course = require './model'
ErrorList = require './error-list'
{ConfirmJoinCourse} = require 'shared'

ConfirmJoin = React.createClass

  propTypes:
    course: React.PropTypes.instanceOf(Course).isRequired
    optionalStudentId: React.PropTypes.bool

  render: ->
    <ConfirmJoinCourse
      courseEnrollmentActions={@props.course}
      courseEnrollmentStore={@props.course}
      errorList={<ErrorList course={@props.course} />}
      optionalStudentId={@props.optionalStudentId}
    />


module.exports = ConfirmJoin
