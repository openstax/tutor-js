React    = require 'react'
Router = require 'react-router-dom'
Name = require '../name'
classnames = require 'classnames'
TutorLink = require '../link'
TOOLTIP_OPTIONS = enable: true, placement: 'top', delayShow: 1500, delayHide: 150

module.exports = React.createClass
  displayName: 'NameCell'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    isConceptCoach: React.PropTypes.bool.isRequired
    student: React.PropTypes.shape(
      first_name: React.PropTypes.string
      last_name: React.PropTypes.string
      role: React.PropTypes.oneOfType([
        React.PropTypes.number, React.PropTypes.string
      ])
      student_identifier: React.PropTypes.string
    ).isRequired

  render: ->
    children = [
      <Name key="name" tooltip={TOOLTIP_OPTIONS}
        className="student-name" {...@props.student} />
      <span key="id" className="student-id">{@props.student.student_identifier}</span>
    ]
    classname = classnames("name-cell", @props.className)

    body = if @props.isConceptCoach
      <div className={classname}>
        {children}
      </div>
    else
      <TutorLink
        to='viewPerformanceGuide' className={classname}
        params={roleId: @props.student.role, courseId: @props.courseId}
      >
         {children}
      </TutorLink>
