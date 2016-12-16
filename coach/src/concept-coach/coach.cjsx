React = require 'react'
_ = require 'underscore'

{ConceptCoach, channel} = require './base'
{CCModal} = require './modal'
{Launcher} = require './launcher'
LoginGateway = require '../user/login-gateway'

Coach = React.createClass
  displayName: 'Coach'
  getDefaultProps: ->
    open: false
    displayLauncher: true
  propTypes:
    open: React.PropTypes.bool
    displayLauncher: React.PropTypes.bool
    filterClick: React.PropTypes.func
    windowImpl: LoginGateway.FakeWindowPropTypes

  getDefaultProps: ->
    window: window

  getInitialState: ->
    {}

  onLogin: ->  @launch('login')
  onEnroll: -> @launch('signup')

  launch: (type) ->
    channel.emit("launcher.clicked.#{type}")
    @setState(openingAs: type, loginWindow: LoginGateway.openWindow(@props.windowImpl, {type}))

  Modal: ->
    return null unless @props.open
    coachProps = _.omit(@props, 'open')
    <CCModal
      filterClick={@props.filterClick}
    >
      <ConceptCoach
        opensAt={@state.opensAs}
        loginWindow={@state.loginWindow}
        {...coachProps}
      />
    </CCModal>

  Launcher: ->
    return null unless @props.displayLauncher
    <Launcher
      isLaunching={open}
      onLogin={@onLogin}
      onEnroll={@onEnroll}
    />

  render: ->
    console.log @props
    <div className='concept-coach-wrapper'>
      <@Launcher />
      <@Modal />
    </div>

module.exports = {Coach, channel}
