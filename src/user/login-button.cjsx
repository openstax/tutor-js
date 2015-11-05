React = require 'react'

User  = require './model'

UserLoginButton = React.createClass

  PropTypes:
    onAttemptLogin: React.PropTypes.func.isRequired

  componentDidMount: ->
    User.channel.on("change", @onUserChange)
  componentWillUnmount: ->
    User.channel.off("change", @onUserChange)

  onUserChange: ->
    @forceUpdate()

  render: ->
    return null if User.isLoggedIn()
    <button onClick={@props.onAttemptLogin}>Login Now</button>

module.exports = UserLoginButton
