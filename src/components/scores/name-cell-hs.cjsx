React    = require 'react'
{ Link } = require 'react-router'
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
      <Link
        className={"student-name #{@props.className}"}
        to="/course/#{@props.courseId}/t/guide/student/#{@props.roleId}?">
         <Name tooltip={TOOLTIP_OPTIONS} {...@props.student} />
      </Link>
    </div>
