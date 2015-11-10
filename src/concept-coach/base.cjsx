React = require 'react'
classnames = require 'classnames'
{SmartOverflow} = require 'openstax-react-components'

{Task} = require '../task'
{Navigation} = require './navigation'
UserLoginButton = require '../user/login-button'
UserLogin = require '../user/login'

{ExerciseStep} = require '../exercise'
{Dashboard} = require '../dashboard'

User = require '../user/model'

{channel} = require './model'

COURSE_ID = '1'

ConceptCoach = React.createClass
  displayName: 'ConceptCoach'

  propTypes:
    close: React.PropTypes.func

  getInitialState: ->
    isLoggedIn: User.isLoggedIn()
    displayLogin: false
    isLoaded: false
    view: 'task'

  onAttemptLogin: ->
    @setState(displayLogin: true)

  onLoginComplete: ->
    @setState(displayLogin: false)

  componentWillMount: ->
    User.ensureStatusLoaded()

  componentDidMount: ->
    mountData = coach: {el: @getDOMNode(), action: 'mount'}
    channel.emit('coach.mount.success', mountData)
    User.channel.on('change', @updateUser)
    channel.on('show.*', @updateView)

  componentWillUnmount: ->
    mountData = coach: {el: @getDOMNode(), action: 'unmount'}
    channel.emit('coach.unmount.success', mountData)
    User.channel.off('change', @updateUser)
    channel.off('show.*', @updateView)

  updateView: (eventData) ->
    {view} = eventData
    @setState({view}) if view?

  updateUser: ->
    @setState(isLoggedIn: User.isLoggedIn(), isLoaded: User.loaded)

  render: ->
    {isLoaded, isLoggedIn, displayLogin, view} = @state

    if isLoggedIn
      if view is 'task'
        coach = <Task {...@props} key='task'/>
      else if view is 'dashboard'
        coach = <Dashboard id={COURSE_ID}/>
    else if displayLogin
      coach = <UserLogin onComplete={@onLoginComplete} />
    else if isLoaded
      coach = <UserLoginButton onAttemptLogin={@onAttemptLogin} key='user-login-button'/>
    else
      coach = 'Loading...'

    className = classnames 'concept-coach-view',
      loading: not (isLoggedIn or isLoaded)

    <div className='concept-coach'>
      <Navigation key='user-status' close={@props.close}/>
      <div className={className}>
        {coach}
      </div>
    </div>

module.exports = {ConceptCoach, channel}
