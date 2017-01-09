React = require 'react'
_ = require 'underscore'


{ConceptCoach, channel} = require './base'
{CCModal} = require './modal'
Launcher = require './launcher'
LoginGateway = require '../user/login-gateway'
User = require '../user/model'
{getCourse} = require '../user/status-mixin'

Coach = React.createClass
  displayName: 'Coach'

  propTypes:
    open: React.PropTypes.bool
    displayLauncher: React.PropTypes.bool
    filterClick: React.PropTypes.func
    windowImpl: LoginGateway.windowPropType
    collectionUUID: React.PropTypes.string.isRequired
    moduleUUID: React.PropTypes.string.isRequired

  getInitialState: ->
    isLoaded: false
    course: getCourse.call(@)

  componentWillReceiveProps: (nextProps) ->
    @setState(course: getCourse.call(@, nextProps)) if nextProps.collectionUUID isnt @props.collectionUUID

  getDefaultProps: ->
    open: false
    displayLauncher: true
    windowImpl: window

  onLoginComplete: ->
    @forceUpdate()

  onLoginClick: ->
    unless User.isLoggedIn()
      LoginGateway.openWindow(@props.windowImpl, type: 'login')
    @launch('login')

  onEnrollClick: ->
    @launch('signup')

  launch: (type) ->
    channel.emit("launcher.clicked.#{type}")

  setIsLoaded: ->
    @setState(isLoaded: true)

  Modal: ->
    coachProps = _.omit(@props, 'open')
    <CCModal filterClick={@props.filterClick}>
      <ConceptCoach {...coachProps} course={@state.course}/>
    </CCModal>

  Launcher: ->
    launcherProps = _.pick(@props, 'enrollmentCode')

    <Launcher
      isLaunching={@props.open}
      onLogin={@onLoginClick}
      onEnroll={@onEnrollClick}
      collectionUUID={@props.collectionUUID}
      {...launcherProps}
      course={@state.course}
    />

  render: ->
    <div className='concept-coach-wrapper'>
      {<@Modal setIsLoaded={@setIsLoaded}/> if @props.open or @state.loginWindow}
      {<@Launcher /> unless @state.isLoaded}
    </div>

module.exports = {Coach, channel}
