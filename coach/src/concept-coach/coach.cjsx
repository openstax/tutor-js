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


  onLoginClick: ->
    @launch('login')

  onEnrollClick: ->
    @launch('signup')

  launch: (type) ->
    if User.isLoggedIn()
      channel.emit("launcher.clicked.#{type}")
    else
      loginWindow = LoginGateway.openWindow(@props.windowImpl, {type})
      @setState({loginWindow, loginType: type})

  # onLoginGatewayComplete: ->
  #   @setState({loginWindow: null})
  #   # TODO: Hookup new enrollment screen here
  #   channel.emit("launcher.clicked.#{@state.loginType}")

  Modal: ->
    coachProps = _.omit(@props, 'open')
    <CCModal filterClick={@props.filterClick}>
      <LoginGateway
        loginWindow={@state.loginWindow}
        loginType={@state.loginType}
        windowImpl={@props.windowImpl}
      >
        <ConceptCoach opensAt={@state.opensAs} {...coachProps} />
      </LoginGateway>
    </CCModal>

  Launcher: ->
    <Launcher
      isLaunching={@props.open}
      onLogin={@onLoginClick}
      onEnroll={@onEnrollClick}
      collectionUUID={@props.collectionUUID}
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
