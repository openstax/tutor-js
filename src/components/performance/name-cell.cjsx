React    = require 'react'
Router = require 'react-router'

module.exports = React.createClass
  displayName: 'NameCell'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    student: React.PropTypes.shape(
      name: React.PropTypes.string
    ).isRequired

  render: ->
    <Router.Link className={"student-name #{@props.className}"} to='viewStudentTeacherGuide'
      params={roleId: @props.roleId, courseId: @props.courseId}>
      {@props.student.name}
    </Router.Link>
