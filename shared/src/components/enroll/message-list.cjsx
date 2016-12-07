React = require 'react'
_ = require 'underscore'

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
    if @props.messages.length == 1 && !@props.forceBullets
      "#{@props.messagesType} list-unstyled"
    else
      @props.messagesType

  render: ->
    return null if _.isEmpty(@props.messages)

    <div className="alert alert-#{@props.alertType}">
      <ul className={@getUlClassName()}>
        {for msg, i in @props.messages
          <li className={@props.liClassName} key={i}>{msg}</li>}
      </ul>
    </div>


module.exports = MessageList
