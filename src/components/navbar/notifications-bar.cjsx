React = require 'react'
_ = require 'underscore'

Icon = require '../icon'
{NotificationStore, NotificationActions} = require '../../flux/notifications'
BindStoreMixin = require '../bind-store-mixin'

Notification = React.createClass
  propTypes:
    notice: React.PropTypes.shape(
      id: React.PropTypes.string.isRequired
      message: React.PropTypes.string.isRequired
    ).isRequired

  acknowledge: ->
    NotificationActions.acknowledge(@props.notice.id)

  render: ->
    <div className="notification">
      <Icon type='info-circle' />
      {@props.notice.message}
      <a onClick={@acknowledge}>Dismiss</a>
    </div>


NotificationBar = React.createClass

  mixins: [BindStoreMixin]
  bindStore: NotificationStore

  render: ->
    notifications = NotificationStore.getActiveNotifications()
    return null if _.isEmpty(notifications)

    <div className="notifications-bar">
      {for notice in notifications
        <Notification key={notice.id} notice={notice} />}
    </div>


module.exports = NotificationBar
