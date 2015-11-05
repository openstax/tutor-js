React = require 'react'

{Task} = require '../task'
UserStatus = require '../user/status'
UserLoginButton = require '../user/login-button'
UserLogin = require '../user/login'

{ExerciseStep} = require '../exercise'

{channel} = require './model'

ConceptCoach = React.createClass
  displayName: 'ConceptCoach'

  onAttemptLogin: ->
    @setState(displayLogin: true)

  onLoginComplete: ->
    @setState(displayLogin: false)

  componentDidMount: ->
    channel.emit('coach.mount.success')

  render: ->
    if @state?.displayLogin
      coach = <UserLogin onComplete={@onLoginComplete} />
    else
      coach = [
        <UserStatus key='user-status'/>
        <UserLoginButton onAttemptLogin={@onAttemptLogin} key='user-login-button'/>
        <Task {...@props} key='task'/>
      ]

    <div className='concept-coach'>
      {coach}
    </div>

module.exports = {ConceptCoach, channel}
