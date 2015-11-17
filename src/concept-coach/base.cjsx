React = require 'react'
classnames = require 'classnames'
{SmartOverflow, SpyMode} = require 'openstax-react-components'

{Task} = require '../task'
{Navigation} = require './navigation'
CourseRegistration = require '../course/registration'
UserLoginButton = require '../user/login-button'
UserLogin = require '../user/login'
UserProfile = require '../user/profile'

{ExerciseStep} = require '../exercise'
{Dashboard} = require '../dashboard'


User = require '../user/model'

{channel} = require './model'

ConceptCoach = React.createClass
  displayName: 'ConceptCoach'

  propTypes:
    close:          React.PropTypes.func
    moduleUUID:     React.PropTypes.string.isRequired
    collectionUUID: React.PropTypes.string.isRequired

  getInitialState: ->
    userState = @getUserState()
    userState.view = 'task'

    userState

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

  showTasks: ->
    @updateView(view: 'task')

  getUserState: ->
    course = User.getCourse(@props.collectionUUID)

    isLoggedIn: User.isLoggedIn(),
    isLoaded: User.isLoaded,
    isRegistered: course?.isRegistered()

  updateUser: ->
    userState = @getUserState()
    @setState(userState)

  childComponent: ->
    {isLoaded, isRegistered, isLoggedIn, displayLogin, view} = @state

    if not isLoaded
      <span><i className='fa fa-spinner fa-spin'/> Loading ...</span>
    else if not isLoggedIn
      <UserLogin onComplete={@updateUser} />
    else if not isRegistered
      <CourseRegistration {...@props} onComplete={@updateUser} />
    else
      course = User.getCourse(@props.collectionUUID)

      if view is 'task'
        <Task {...@props} key='task'/>
      else if view is 'dashboard'
        <Dashboard id={course.id}/>
      else if view is 'profile'
        <UserProfile onComplete={@showTasks} />
      else
        <h3 className="error">bad internal state, no view is set</h3>

  render: ->
    {isLoaded, isLoggedIn} = @state
    course = User.getCourse(@props.collectionUUID)

    className = classnames 'concept-coach-view',
      loading: not (isLoggedIn or isLoaded)

    <div className='concept-coach'>
      <SpyMode.Wrapper>
        <Navigation key='user-status' close={@props.close} course={course}/>
        <div className={className}>
          {@childComponent()}
        </div>
      </SpyMode.Wrapper>
    </div>

module.exports = {ConceptCoach, channel}
