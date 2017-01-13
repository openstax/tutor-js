React = require 'react'
_ = require 'underscore'
deepMerge = require 'lodash/merge'

{ConceptCoach, channel} = require './base'
{CCModal} = require './modal'
Launcher = require './launcher'
LoginGateway = require '../user/login-gateway'
User = require '../user/model'

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
    isEnrollmentCodeValid: false

  getDefaultProps: ->
    open: false
    displayLauncher: true
    windowImpl: window

  onLoginComplete: ->
    @forceUpdate()

  onLoginClick: ->
    unless User.isLoggedIn()
      LoginGateway.openWindow(@props.windowImpl, type: 'login')
    @launch('login', 'login')

  onEnrollClick: ->
    @launch('signup', 'registration')

  onLaunchClick: ->
    @launch('task', 'task')

  onEnrollSecondSemester: ->
    @launch('signup', 'second-semester-registration')

  launch: (type, view) ->
    channel.emit("launcher.clicked.#{type}", defaultView: view)

  setIsLoaded: ->
    @setState(isLoaded: true)

  setIsEnrollmentCodeValid: (isValid) ->
    @setState(isEnrollmentCodeValid: isValid)

  Modal: (props) ->
    propsToOmit = ['open']
    propsToOmit.push('enrollmentCode') unless @state.isEnrollmentCodeValid
    coachProps = deepMerge(_.omit(@props, propsToOmit), props)

    <CCModal filterClick={@props.filterClick}>
      <ConceptCoach {...coachProps} />
    </CCModal>

  Launcher: (props) ->
    launcherProps = deepMerge(_.pick(@props, 'enrollmentCode'), props)

    <Launcher
      isLaunching={@props.open}
      onLogin={@onLoginClick}
      onEnroll={@onEnrollClick}
      onLaunch={@onLaunchClick}
      onEnrollSecondSemester={@onEnrollSecondSemester}
      collectionUUID={@props.collectionUUID}
      {...launcherProps}
    />

  render: ->
    <div className='concept-coach-wrapper'>
      {<@Modal setIsLoaded={@setIsLoaded}/> if @props.open or @state.loginWindow}
      {<@Launcher setIsEnrollmentCodeValid={@setIsEnrollmentCodeValid}/> unless @state.isLoaded}
    </div>

module.exports = {Coach, channel}
