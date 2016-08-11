React = require 'react'
_ = require 'underscore'

Notifications = require '../../model/notifications'

TYPES =
  system: require './system'
  accounts: require './email'

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

    <div className="openstax-notifications-bar">
      {for notice in notifications
        Component = TYPES[notice.type] or TYPES['system']
        <Component key={notice.id} notice={notice} />}
    </div>


module.exports = NotificationBar
