React = require 'react'
Notifications = require '../../model/notifications'

CourseHasEndedNotification = React.createClass
  displayName: 'CourseHasEndedNotification'
  propTypes:
    callbacks: React.PropTypes.shape(
      onCCSecondSemester: React.PropTypes.func.isRequired
    )
    notice: React.PropTypes.shape(
      id: React.PropTypes.oneOfType([
        React.PropTypes.number, React.PropTypes.string
      ])
    )

  onSecondSemesterClick: ->
    @props.callbacks.onCCSecondSemester(@props.notice)

  actionsLink: ->
    return null unless @props.callbacks?.onCCSecondSemester
    <a className='action' onClick={@onSecondSemesterClick}>
      Click to enroll in second semester
    </a>

  render: ->
    <div className='notification course-has-ended'>
      <span className="body">
        <i className="icon fa fa-info-circle" />
        <span>This course has ended.</span>
        {@actionsLink()}
      </span>
    </div>

module.exports = CourseHasEndedNotification
