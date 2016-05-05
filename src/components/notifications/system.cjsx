React = require 'react'

Notifications = require '../../model/notifications'

SystemNotification = React.createClass
  propTypes:
    notice: React.PropTypes.shape(
      id: React.PropTypes.string.isRequired
      message: React.PropTypes.string.isRequired
    ).isRequired

  acknowledge: ->
    Notifications.acknowledge(@props.notice)
    undefined # silence React warning about return value

  render: ->
    <div className="notification">
      <i className='icon fa fa-info-circle' />
      {@props.notice.message}
      <a className='action' onClick={@acknowledge}>Dismiss</a>
    </div>

module.exports = SystemNotification
