React    = require 'react'
Router = require 'react-router'
Name = require '../name'
classnames = require 'classnames'

TOOLTIP_OPTIONS = enable: true, placement: 'top', delayShow: 1500, delayHide: 150

module.exports = React.createClass
  displayName: 'NameCell'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    isConceptCoach: React.PropTypes.bool.isRequired
    student: React.PropTypes.shape(
      first_name: React.PropTypes.string
      last_name: React.PropTypes.string
      student_identifier: React.PropTypes.string
    ).isRequired

  render: ->
    children = [
      <Name key="name" tooltip={TOOLTIP_OPTIONS}
        className="student-name" {...@props.student} />
      <span key="id" className="student-id">{@props.student.student_identifier}</span>
    ]
    classname = classnames("name-cell", @props.className)

    if @props.isConceptCoach
      <div className={classname}>
        {children}
      </div>
    else
      <Router.Link
        className={classname}
        to='viewStudentTeacherPerformanceForecast'
        params={roleId: @props.roleId, courseId: @props.courseId}>
         {children}
      </Router.Link>
