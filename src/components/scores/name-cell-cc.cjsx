React    = require 'react'
Router = require 'react-router'
Name = require '../name'

TOOLTIP_OPTIONS = enable: true, placement: 'top', delayShow: 1500, delayHide: 150

module.exports = React.createClass
  displayName: 'CCNameCell'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    student: React.PropTypes.shape(
      first_name: React.PropTypes.string
      last_name: React.PropTypes.string
    ).isRequired

  render: ->
    <div className="name-cell">
      <Name tooltip={TOOLTIP_OPTIONS} className="name" {...@props.student} />
      <div className="student-id">{@props.student.student_identifier}</div>
    </div>
