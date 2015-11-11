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
      <BS.Button
        bsStyle='primary'
        bsSize='large'
        onClick={@props.onAttemptLogin}>
          Login
      </BS.Button>
    </div>

module.exports = UserLoginButton
