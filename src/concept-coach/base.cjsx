React = require 'react'
classnames = require 'classnames'
{SmartOverflow} = require 'openstax-react-components'

{Task} = require '../task'
{Navigation} = require './navigation'
UserLoginButton = require '../user/login-button'
UserLogin = require '../user/login'

{ExerciseStep} = require '../exercise'
{Dashboard} = require '../dashboard'

CourseRegistration = require '../course/registration'
User = require '../user/model'

{channel} = require './model'

ConceptCoach = React.createClass
  displayName: 'ConceptCoach'

  propTypes:
    close:          React.PropTypes.func
    moduleUUID:     React.PropTypes.string.isRequired
    collectionUUID: React.PropTypes.string.isRequired

  getInitialState: ->
    isLoggedIn: User.isLoggedIn()
    displayLogin: false
    view: 'task'
    isLoaded: User.isLoaded
    isRegistered: false

  onAttemptLogin: ->
    @setState(displayLogin: true)

  onLoginComplete: ->
    @setState(displayLogin: false)

  componentWillMount: ->
    User.ensureStatusLoaded()

  componentDidMount: ->
    @updateUser()
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
    course = User.getCourse(@props.collectionUUID)

    @setState(
      isLoggedIn: User.isLoggedIn(),
      isLoaded: User.isLoaded,
      isRegistered: course?.isRegistered()
    )

  childComponent: ->
    {isLoaded, isRegistered, isLoggedIn, displayLogin, view} = @state

    if not isLoaded
      <span><i className='fa fa-spinner fa-spin'/> Loading ...</span>
    else if not isLoggedIn
      <UserLogin onComplete={@onLoginComplete} />
    else if not isRegistered
      <CourseRegistration {...@props} onComplete={@update} />
    else
      course = User.getCourse(@props.collectionUUID)

      if view is 'task'
        coach = <Task {...@props} key='task'/>
      else if view is 'dashboard'
        coach = <Dashboard id={course.id}/>

  render: ->
    {isLoaded, isLoggedIn} = @state

    className = classnames 'concept-coach-view',
      loading: not (isLoggedIn or isLoaded)

    <div className='concept-coach'>
      <Navigation key='user-status' close={@props.close}/>
      <div className={className}>
        {@childComponent()}
      </div>
    </div>

module.exports = {ConceptCoach, channel}
