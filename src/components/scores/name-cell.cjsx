React    = require 'react'
Router = require 'react-router'
Name = require '../name'

module.exports = React.createClass
  displayName: 'NameCell'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    isConceptCoach: React.PropTypes.bool.isRequired
    student: React.PropTypes.shape(
      first_name: React.PropTypes.string
      last_name: React.PropTypes.string
    ).isRequired

  render: ->
    name = <Name {...@props.student} />
    link =
      <Router.Link
        className={"student-name #{@props.className}"}
        to='viewStudentTeacherPerformanceForecast'
        params={roleId: @props.roleId, courseId: @props.courseId}>
        {name}
      </Router.Link>
    <div>
      {if @props.isConceptCoach then name else link}
    </div>
