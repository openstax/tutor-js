React    = require 'react'
Router = require 'react-router'
Name = require '../name'

TOOLTIP_OPTIONS = enable: true, placement: 'top', delayShow: 1500, delayHide: 150

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
    if @props.isConceptCoach
      nameCell = 
        <Name tooltip={TOOLTIP_OPTIONS} className="name" {...@props.student} />
    else
      nameCell =
        <Router.Link
          className={"student-name #{@props.className}"}
          to='viewStudentTeacherPerformanceForecast'
          params={roleId: @props.roleId, courseId: @props.courseId}>
           <Name tooltip={TOOLTIP_OPTIONS} {...@props.student} />
        </Router.Link>

    <div className="name-cell">
      {nameCell}
    </div>
