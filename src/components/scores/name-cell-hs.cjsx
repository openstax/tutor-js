React    = require 'react'
Router = require 'react-router'
Name = require '../name'

TOOLTIP_OPTIONS = enable: true, placement: 'top', delayShow: 1500, delayHide: 150

module.exports = React.createClass
  displayName: 'HSNameCell'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    student: React.PropTypes.shape(
      first_name: React.PropTypes.string
      last_name: React.PropTypes.string
    ).isRequired

  render: ->
    <div className="name-cell">
      <Router.Link
        className={"student-name fullwidth #{@props.className}"}
        to='viewStudentTeacherPerformanceForecast'
        params={roleId: @props.roleId, courseId: @props.courseId}>
         <Name tooltip={TOOLTIP_OPTIONS} {...@props.student} />
      </Router.Link>
    </div>
