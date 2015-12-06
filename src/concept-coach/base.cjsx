React = require 'react'

_ = require 'underscore'
classnames = require 'classnames'
{SmartOverflow, SpyMode} = require 'openstax-react-components'

{Task} = require '../task'
navigation = {Navigation} = require '../navigation'
CourseRegistration = require '../course/registration'
ErrorNotification = require './error-notification'
AccountsIframe = require '../user/accounts-iframe'

{ExerciseStep} = require '../exercise'
{Dashboard} = require '../dashboard'
{Progress} = require '../progress'


User = require '../user/model'

{channel} = require './model'

# TODO Move this and auth logic to user model
# These views are used with an authLevel (0, 1, 2, or 3) to determine what views the user is allowed to see.
VIEWS = ['loading', 'login', 'registration', ['task', 'progress', 'profile', 'dashboard', 'registration']]

ConceptCoach = React.createClass
  displayName: 'ConceptCoach'

  propTypes:
    close:          React.PropTypes.func
    moduleUUID:     React.PropTypes.string.isRequired
    collectionUUID: React.PropTypes.string.isRequired

  getDefaultProps: ->
    defaultView: _.chain(VIEWS).last().first().value()

  getInitialState: ->
    userState = @getUserState()

    view = @getAllowedView(userState)

    userState.view = view
    userState

  childContextTypes:
    view: React.PropTypes.oneOf(_.flatten(VIEWS))
    cnxUrl: React.PropTypes.string
    bookUrlPattern: React.PropTypes.string
    close: React.PropTypes.func

  getChildContext: ->
    {view} = @state
    {cnxUrl, close} = @props
    bookUrlPattern = '{cnxUrl}/contents/{ecosystem_book_uuid}'

    {view, cnxUrl, close, bookUrlPattern}

  componentWillMount: ->
    User.ensureStatusLoaded()

  componentDidMount: ->
    mountData = @getMountData('mount')
    channel.emit('coach.mount.success', mountData)

    User.channel.on('change', @updateUser)
    navigation.channel.on('show.*', @updateView)

  componentWillUnmount: ->
    mountData = @getMountData('ummount')
    channel.emit('coach.unmount.success', mountData)

    User.channel.off('change', @updateUser)
    navigation.channel.off('show.*', @updateView)

  getAllowedView: (userInfo) ->
    {defaultView} = @props

    if not userInfo.isLoaded
      authLevel = 0
    else if not userInfo.isLoggedIn
      authLevel = 1
    else if not userInfo.isRegistered
      authLevel = 2
    else
      authLevel = 3

    view = VIEWS[authLevel]

    # if there are multiple views allowed for this level
    if _.isArray(view)
      # and the target/defaultView is one of the views in this level
      if defaultView in view
        # then the iew should be the defaultView
        view = defaultView
      else
        # else, the view should be the first of views allowed for this level
        view = _.first(view)

    view

  getMountData: (action) ->
    {moduleUUID, collectionUUID} = @props
    {view} = @state
    el = @getDOMNode()

    coach: {el, action, view, moduleUUID, collectionUUID}

  updateView: (eventData) ->
    {view} = eventData
    @setState({view}) if view?

  showTasks: ->
    @updateView(view: 'task')

  getUserState: ->
    {collectionUUID} = @props
    course = User.getCourse(collectionUUID)

    userInfo =
      isLoggedIn: User.isLoggedIn()
      isLoaded: User.isLoaded
      isRegistered: course?.isRegistered()

  updateUser: ->
    userState = @getUserState()
    view = @getAllowedView(userState)

    # tell nav to update view if the next view isn't the current view
    navigation.channel.emit("show.#{view}", view: view) if view isnt @state.view

    @setState(userState)

  childComponent: ->
    {view} = @state
    course = User.getCourse(@props.collectionUUID)

    switch view
      when 'loading'
        <span><i className='fa fa-spinner fa-spin'/> Loading ...</span>
      when 'login'
        <AccountsIframe type='login' onComplete={@updateUser} />
      when 'registration'
        <CourseRegistration {...@props} />
      when 'task'
        <Task {...@props} key='task'/>
      when 'progress'
        <Progress id={course.id}/>
      when 'dashboard'
        <Dashboard cnxUrl={@props.cnxUrl}/>
      when 'profile'
        <AccountsIframe type='profile' onComplete={@updateUser} />
      when 'registration'
        <CourseRegistration {...@props} />
      else
        <h3 className="error">bad internal state, no view is set</h3>

  render: ->
    {isLoaded, isLoggedIn, view} = @state
    course = User.getCourse(@props.collectionUUID)

    className = classnames 'concept-coach-view', "concept-coach-view-#{view}",
      loading: not (isLoggedIn or isLoaded)

    <div className='concept-coach openstax-wrapper'>
      <ErrorNotification />

      <SpyMode.Wrapper>
        <Navigation key='user-status' close={@props.close} course={course}/>
        <div className={className}>
          {@childComponent()}
        </div>
      </SpyMode.Wrapper>
    </div>

module.exports = {ConceptCoach, channel}
