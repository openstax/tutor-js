React = require 'react'
_ = require 'underscore'

classnames = require 'classnames'

MessageList = React.createClass

  propTypes:
    messages: React.PropTypes.array.isRequired
    alertType: React.PropTypes.string
    messagesType: React.PropTypes.string
    forceBullets: React.PropTypes.bool

  getDefaultProps: ->
    alertType: "danger"
    messagesType: "errors"
    forceBullets: false

  getUlClassName: ->
    classnames('message-list', @props.messagesType,
      {'list-unstyled': @props.messages.length == 1 && !@props.forceBullets}
    )

  render: ->
    return null if _.isEmpty(@props.messages)

    <div className="alert alert-#{@props.alertType}">
      <ul className={@getUlClassName()}>
        {for msg, i in @props.messages
          <li className={@props.liClassName} key={i}>{msg}</li>}
      </ul>
    </div>


module.exports = MessageList
