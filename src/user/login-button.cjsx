React = require 'react'
BS = require 'react-bootstrap'

User  = require './model'

UserLoginButton = React.createClass

  propTypes:
    onAttemptLogin: React.PropTypes.func.isRequired

  componentDidMount: ->
    User.channel.on("change", @onUserChange)
  componentWillUnmount: ->
    User.channel.off("change", @onUserChange)

  onUserChange: ->
    @forceUpdate()

  render: ->
    return null if User.isLoggedIn()
    <div className='text-center'>
      <h1>
        Super charge your learning experience.
      </h1>
      <h3>
        <i>Login and get a coach!</i>
      </h3>
      <div
        className='concept-coach-login'
        onClick={@props.onAttemptLogin}/>
    </div>

module.exports = UserLoginButton
