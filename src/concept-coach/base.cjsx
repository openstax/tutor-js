React = require 'react'
classnames = require 'classnames'
{SmartOverflow} = require 'openstax-react-components'

{Task} = require '../task'
UserStatus = require '../user/status'
UserLoginButton = require '../user/login-button'
UserLogin = require '../user/login'

{ExerciseStep} = require '../exercise'

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
    isLoaded: User.isLoaded

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
    course = User.getCourse(@props.collectionUUID)
    @setState(
      isLoggedIn: User.isLoggedIn(),
      isLoaded: User.isLoaded,
      isRegistered: course?.isRegistered()
    )

  childComponent: ->
    {isLoaded, isRegistered, isLoggedIn, displayLogin} = @state
    if not isLoaded
      <span><i className='fa fa-spinner fa-spin'/> Loading ...</span>
    else if not isLoggedIn
      <UserLogin onComplete={@onLoginComplete} />
    else if not isRegistered
      <CourseRegistration {...@props} onComplete={@update} />
    else
      <Task {...@props} key='task'/>

  render: ->
    {isLoaded, isLoggedIn} = @state

    className = classnames 'concept-coach-view',
      loading: not (isLoggedIn or isLoaded)

    <div className='concept-coach'>
      <UserStatus key='user-status' close={@props.close}/>
      <div className={className}>
        {@childComponent()}
      </div>
    </div>

module.exports = {ConceptCoach, channel}
