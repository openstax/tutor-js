React = require 'react'
_ = require 'underscore'


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
    {}

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

  Modal: ->
    coachProps = _.omit(@props, 'open')
    <CCModal filterClick={@props.filterClick}>
      <ConceptCoach {...coachProps} />
    </CCModal>

  Launcher: ->
    launcherProps = _.pick(@props, 'enrollmentCode')

    <Launcher
      isLaunching={@props.open}
      onLogin={@onLoginClick}
      onEnroll={@onEnrollClick}
      collectionUUID={@props.collectionUUID}
      {...launcherProps}
    />

  render: ->
    Component = if @props.open or @state.loginWindow
      @Modal
    else
      @Launcher

    <div className='concept-coach-wrapper'>
      <Component />
    </div>

module.exports = {Coach, channel}
