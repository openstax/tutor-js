React = require 'react'
Notifications = require '../../model/notifications'

MissingStudentIdNotification = React.createClass
  displayName: 'MissingStudentIdNotification'
  propTypes:
    callbacks: React.PropTypes.shape(
      onAdd: React.PropTypes.func.isRequired
    ).isRequired
    notice: React.PropTypes.shape(
      role:   React.PropTypes.shape(
        id: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number,
        ])
        type:      React.PropTypes.string
        joined_at: React.PropTypes.string
        latest_enrollment_at: React.PropTypes.string
      )
      course: React.PropTypes.shape(
        id: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number,
        ])
      )
    ).isRequired

  onAddClicked: ->
    Notifications.acknowledge(@props.notice)
    @props.callbacks.onAdd(@props.notice)

  render: ->
    <div className='notification missing-student-id'>
      <span className="body">
        <i className="icon fa fa-info-circle" />
        <span>To get credit for your work, add your student ID.</span>
        <a className='action' onClick={@onAddClicked}>Add Student ID</a>
      </span>
    </div>

module.exports = MissingStudentIdNotification
