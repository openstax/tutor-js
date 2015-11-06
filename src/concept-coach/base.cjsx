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
    channel.emit('coach.mount.success')
    User.channel.on('change', @update)

  componentWillUnmount: ->
    channel.emit('coach.unmount.success')
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

    <SmartOverflow
      className='concept-coach'
      heightBuffer={0}>
      <UserStatus key='user-status' close={@props.close}/>
      <div className={className}>
        {coach}
      </div>
    </SmartOverflow>

module.exports = {ConceptCoach, channel}
