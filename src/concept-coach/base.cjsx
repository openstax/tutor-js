React = require 'react'
classnames = require 'classnames'
{SmartOverflow} = require 'openstax-react-components'

{Task} = require '../task'
UserStatus = require '../user/status'
UserLoginButton = require '../user/login-button'
UserLogin = require '../user/login'

{ExerciseStep} = require '../exercise'

User = require '../user/model'

{channel} = require './model'

ConceptCoach = React.createClass
  displayName: 'ConceptCoach'

  propTypes:
    close: React.PropTypes.func

  getInitialState: ->
    isLoggedIn: User.isLoggedIn()
    displayLogin: false
    isLoaded: false

  onAttemptLogin: ->
    @setState(displayLogin: true)

  onLoginComplete: ->
    @setState(displayLogin: false)

  componentWillMount: ->
    User.ensureStatusLoaded()

  componentDidMount: ->
    mountData = coach: {el: @getDOMNode(), action: 'mount'}
    channel.emit('coach.mount.success', mountData)
    User.channel.on('change', @update)

  componentWillUnmount: ->
    mountData = coach: {el: @getDOMNode(), action: 'unmount'}
    channel.emit('coach.unmount.success', mountData)
    User.channel.off('change', @update)

  update: ->
    @setState(isLoggedIn: User.isLoggedIn(), isLoaded: User.loaded)

  render: ->
    {isLoaded, isLoggedIn, displayLogin} = @state

    if isLoggedIn
      coach = <Task {...@props} key='task'/>
    else if displayLogin
      coach = <UserLogin onComplete={@onLoginComplete} />
    else if isLoaded
      coach = <UserLoginButton onAttemptLogin={@onAttemptLogin} key='user-login-button'/>
    else
      coach = 'Loading...'

    className = classnames 'concept-coach-view',
      loading: not (isLoggedIn or isLoaded)

    <div className='concept-coach'>
      <UserStatus key='user-status' close={@props.close}/>
      <div className={className}>
        {coach}
      </div>
    </div>

module.exports = {ConceptCoach, channel}
