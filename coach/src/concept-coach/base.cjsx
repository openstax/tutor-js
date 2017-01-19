React = require 'react'
ReactDOM = require 'react-dom'
_ = require 'underscore'
classnames = require 'classnames'
EventEmitter2 = require 'eventemitter2'

{SmartOverflow, SpyMode} = require 'shared'

{Task} = require '../task'
navigation = {Navigation} = require '../navigation'
CourseRegistration = require '../course/registration'
ErrorNotification = require './error-notification'
SafariWarning = require './safari-warning'
AccountsIframe = require '../user/accounts-iframe'
UpdateStudentIdentifier = require '../course/update-student-identifier'
LoginGateway = require '../user/login-gateway'
User = require '../user/model'

{ExerciseStep} = require '../exercise'
{Dashboard} = require '../dashboard'
{Progress} = require '../progress'

{channel} = require './model'
navigator = navigation.channel

# TODO Move this and auth logic to user model
# These views are used with an authLevel (0, 1, 2, or 3) to determine what views the user is allowed to see.
VIEWS = [
  'loading', 'login',
  ['registration', 'second-semester-registration'],
  [
    'task', 'progress', 'profile', 'dashboard', 'student_id',
    'registration', 'second-semester-registration'
  ],
  'logout'
]

ConceptCoach = React.createClass
  displayName: 'ConceptCoach'

  propTypes:
    close:          React.PropTypes.func
    moduleUUID:     React.PropTypes.string.isRequired
    collectionUUID: React.PropTypes.string.isRequired
    triggeredFrom:  React.PropTypes.shape(
      moduleUUID:     React.PropTypes.string
      collectionUUID: React.PropTypes.string
    )

  getDefaultProps: ->
    defaultView: _.chain(VIEWS).last().first().value()

  getInitialState: ->
    userState = User.status(@props.collectionUUID, @props.enrollmentCode)
    view = @getAllowedView(userState)
    userState.view = view
    _.extend(ignoreDefaultView: false, userState)

  childContextTypes:
    moduleUUID:     React.PropTypes.string
    collectionUUID: React.PropTypes.string
    enrollmentCode: React.PropTypes.string
    triggeredFrom:  React.PropTypes.shape(
      moduleUUID:     React.PropTypes.string
      collectionUUID: React.PropTypes.string
    )
    getNextPage: React.PropTypes.func
    view: React.PropTypes.oneOf(_.flatten(VIEWS))
    cnxUrl: React.PropTypes.string
    bookUrlPattern: React.PropTypes.string
    close: React.PropTypes.func
    navigator: React.PropTypes.instanceOf(EventEmitter2)
    processHtmlAndMath: React.PropTypes.func

  getChildContext: ->
    {view} = @state
    {cnxUrl, close, moduleUUID, collectionUUID, enrollmentCode, getNextPage, triggeredFrom} = @props
    bookUrlPattern = '{cnxUrl}/contents/{ecosystem_book_uuid}'
    processHtmlAndMath = @props.processHtmlAndMath

    {
      view,
      cnxUrl,
      close,
      processHtmlAndMath,
      bookUrlPattern,
      navigator,
      moduleUUID,
      collectionUUID,
      enrollmentCode,
      triggeredFrom,
      getNextPage
    }

  componentWillMount: ->
    User.ensureStatusLoaded()

  componentDidMount: ->
    mountData = @getMountData('mount')
    channel.emit('coach.mount.success', mountData)

    User.channel.on('change', @updateUser)
    navigator.on('show.*', @updateView)

  componentWillUnmount: ->
    mountData = @getMountData('ummount')
    channel.emit('coach.unmount.success', mountData)

    User.channel.off('change', @updateUser)
    navigator.off('show.*', @updateView)

  getAllowedView: (userInfo) ->
    {defaultView, collectionUUID, enrollmentCode} = @props
    ignoreDefaultView = @state?.ignoreDefaultView or false
    course = User.getCourse(collectionUUID, enrollmentCode)

    if not userInfo.isLoaded
      authLevel = 0
    else if userInfo.preValidate
      authLevel = 2 # prevalidate the course
    else if not userInfo.isLoggedIn
      authLevel = 1 # login / signup
    else if not userInfo.isRegistered
      authLevel = 2 # complete joining the course
    else
      authLevel = 3

    view = VIEWS[authLevel]

    # if there are multiple views allowed for this level
    if _.isArray(view)
      # and the target/defaultView is one of the views in this level
      if not ignoreDefaultView and defaultView in view
        # then the iew should be the defaultView
        view = defaultView
      else
        # else, the view should be the first of views allowed for this level
        view = _.first(view)

    view

  unsetDefaultView: ->
    if User.status(@props.collectionUUID, @props.enrollmentCode).isRegistered
      @setState(ignoreDefaultView: true)
      @updateUser()

  getMountData: (action) ->
    {moduleUUID, collectionUUID} = @props
    {view} = @state
    el = ReactDOM.findDOMNode @

    coach: {el, action, view, moduleUUID, collectionUUID}

  updateView: (eventData) ->
    {view} = eventData
    @setState({view}) if view? and view isnt @state.view

  showTasks: ->
    @updateView(view: 'task')

  updateUser: (options) ->
    @setState(ignoreDefaultView: true) if options?.justConfirmed
    userState = User.status(@props.collectionUUID, @props.enrollmentCode)
    view = @getAllowedView(userState)

    # tell nav to update view if the next view isn't the current view
    navigator.emit("show.#{view}", view: view) if view isnt @state.view

    @setState(userState)

  childComponent: (course) ->
    {view} = @state
    switch view
      when 'loading'
        <span><i className='fa fa-spinner fa-spin'/> Loading ...</span>
      when 'logout'
        <AccountsIframe type='logout' />
      when 'login'
        <LoginGateway />
      when 'registration'
        <CourseRegistration {...@props} onLoginComplete={@unsetDefaultView}/>
      when 'second-semester-registration'
        <CourseRegistration {...@props} secondSemester=true  onLoginComplete={@unsetDefaultView}/>
      when 'task'
        <Task {...@props} key='task'/>
      when 'progress'
        <Progress id={course.id}/>
      when 'dashboard'
        <Dashboard cnxUrl={@props.cnxUrl}/>
      when 'profile'
        <AccountsIframe type='profile' onComplete={@updateUser} />
      when 'student_id'
        <UpdateStudentIdentifier {...@props} course={course} />
      else
        <h3 className="error">bad internal state, no view is set</h3>

  render: ->
    {isLoaded, isLoggedIn, view} = @state
    course = User.getCourse(@props.collectionUUID, @props.enrollmentCode)

    className = classnames 'concept-coach-view', "concept-coach-view-#{view}",
      loading: not (isLoggedIn or isLoaded)

    <div className='concept-coach openstax-wrapper'>
      <ErrorNotification container={@} course={course} close={@props.close} />

      <SpyMode.Wrapper>
        <Navigation key='user-status' close={@props.close} course={course}/>
        <SafariWarning />
        <div className={className}>
          {@childComponent(course)}
        </div>
      </SpyMode.Wrapper>
    </div>

module.exports = {ConceptCoach, channel}
