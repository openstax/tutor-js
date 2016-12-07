React = require 'react'
_ = require 'underscore'

MessageList = React.createClass

  propTypes:
    messages: React.PropTypes.array.isRequired
    divClassName: React.PropTypes.string
    ulClassName: React.PropTypes.string
    liClassName: React.PropTypes.string

  getDefaultProps: ->
    divClassName: "alert alert-danger"
    ulClassName: "errors"
    liClassName: ""

  render: ->
    return null if _.isEmpty(@props.messages)

    <div className={@props.divClassName}>
      <ul className={@props.ulClassName}>
        {for msg, i in @props.messages
          <li className={@props.liClassName} key={i}>{msg}</li>}
      </ul>
    </div>


module.exports = MessageList
