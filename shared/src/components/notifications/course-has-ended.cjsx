React = require 'react'
Notifications = require '../../model/notifications'

CourseHasEndedNotification = React.createClass
  displayName: 'CourseHasEndedNotification'
  propTypes:
    callbacks: React.PropTypes.shape(
      onCCSecondSemester: React.PropTypes.func.isRequired
    )

  actionsLink: ->
    return null unless @props.callbacks?.onCCSecondSemester
    <a className='action' onClick={@props.callbacks.onCCSecondSemester}>
      Using Concept Coach over two semesters?
    </a>

  render: ->
    <div className='notification course-has-ended'>
      <span className="body">
        <i className="icon fa fa-info-circle" />
        <span>This course is no longer active.</span>
        {@actionsLink()}
      </span>
    </div>

module.exports = CourseHasEndedNotification
