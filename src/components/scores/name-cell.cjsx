React    = require 'react'
Router = require 'react-router'
Name = require '../name'

module.exports = React.createClass
  displayName: 'NameCell'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    student: React.PropTypes.shape(
      first_name: React.PropTypes.string
      last_name: React.PropTypes.string
    ).isRequired

  render: ->
    <Router.Link className={"student-name #{@props.className}"} to='viewStudentTeacherGuide'
      params={roleId: @props.roleId, courseId: @props.courseId}>
      <Name {...@props.student} />
    </Router.Link>
