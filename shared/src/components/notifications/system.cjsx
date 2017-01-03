React = require 'react'
classnames = require 'classnames'

SystemNotification = React.createClass

  displayName: 'SystemNotification'

  propTypes:
    onDismiss: React.PropTypes.func.isRequired
    notice: React.PropTypes.shape(
      id: React.PropTypes.string.isRequired
      message: React.PropTypes.string.isRequired
    ).isRequired

  getIcon: ->
    return @props.notice.icon if @props.notice.icon
    switch @props.notice.level
      when 'alert' then 'exclamation-triangle'
      when 'error', 'warning' then 'exclamation-circle'
      else
        'info-circle'

  render: ->

    <div className={classnames('notification', 'system', @props.notice.level,
      {acknowledged: @props.notice.acknowledged}
    )}>
      <span className="body">
        <i className={"icon fa fa-#{@getIcon()}"} />
        {@props.notice.message}
      </span>
      <a className='dismiss' onClick={@props.onDismiss}>
        <i className="icon fa fa-close" />
      </a>
    </div>

module.exports = SystemNotification
