React = require 'react'
_ = require 'underscore'

Notifications = require '../model/notifications'

Notification = React.createClass
  propTypes:
    notice: React.PropTypes.shape(
      id: React.PropTypes.string.isRequired
      message: React.PropTypes.string.isRequired
    ).isRequired

  acknowledge: ->
    Notifications.acknowledge(@props.notice)

  render: ->
    <div className="notification">
      <i className='fa fa-info-circle' />

      {@props.notice.message}
      <a className='dismiss' onClick={@acknowledge}>Dismiss</a>
    </div>


NotificationBar = React.createClass

  componentWillMount: ->
    Notifications.on('change', @onChange)
  componentWillUnmount: ->
    Notifications.off('change', @onChange)

  onChange: ->
    @forceUpdate()

  render: ->
    notifications = Notifications.getActive()
    return null if _.isEmpty(notifications)

    <div className="notifications-bar">
      {for notice in notifications
        <Notification key={notice.id} notice={notice} />}
    </div>


module.exports = NotificationBar
