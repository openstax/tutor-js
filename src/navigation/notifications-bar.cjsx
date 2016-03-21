React = require 'react'
_ = require 'underscore'
Notifications = require './notifications-model'

Notification = React.createClass
  propTypes:
    notice: React.PropTypes.shape(
      id: React.PropTypes.string.isRequired
      message: React.PropTypes.string.isRequired
    ).isRequired

  acknowledge: ->
    Notifications.acknowledge(@props.notice.id)

  render: ->
    <div className="notification">
      <i className='icon fa fa-info-circle'/>
      {@props.notice.message}
      <a className='dismiss' onClick={@acknowledge}>Dismiss</a>
    </div>


NotificationBar = React.createClass

  componentWillMount: ->
    Notifications.channel.on('change', @onNoticeChange)

  componentWillUnmount: ->
    Notifications.channel.off('change', @onNoticeChange)

  onNoticeChange: -> @forceUpdate()

  render: ->
    notifications = Notifications.getActive()
    return null if _.isEmpty(notifications)

    <div className="notifications-bar">
      {for notice in notifications
        <Notification key={notice.id} notice={notice} />}
    </div>


module.exports = NotificationBar
