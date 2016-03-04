React = require 'react'
_ = require 'underscore'

Icon = require '../icon'
{NotificationStore, NotificationActions} = require '../../flux/notifications'
BindStoreMixin = require '../bind-store-mixin'

Notification = React.createClass
  propTypes:
    notice_id: React.PropTypes.string.isRequired
    notice: React.PropTypes.shape(
      type: React.PropTypes.string.isRequired
      message: React.PropTypes.string.isRequired
    ).isRequired

  acknowledge: ->
    NotificationActions.acknowledge(@props.notice_id)

  render: ->
    <div className="notification #{@props.notice.type}">
      <b>{@props.notice.title}</b>
      {@props.notice.message}
      <Icon type="close" onClick={@acknowledge} />
    </div>


NotificationBar = React.createClass

  mixins: [BindStoreMixin]
  bindStore: NotificationStore

  render: ->
    notifications = NotificationStore.getActiveNotifications()

    return null if _.isEmpty(notifications)
    <div className="notifications-bar">
      {for notice_id, notice of notifications
        <Notification key={notice.id} notice_id={notice_id} notice={notice} />}
    </div>


module.exports = NotificationBar
