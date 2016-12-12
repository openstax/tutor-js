React = require 'react'
_ = require 'underscore'

{ConceptCoach, channel} = require './base'
{CCModal} = require './modal'
{Launcher} = require './launcher'

Coach = React.createClass
  displayName: 'Coach'
  getDefaultProps: ->
    open: false
    displayLauncher: true
  propTypes:
    open: React.PropTypes.bool
    displayLauncher: React.PropTypes.bool
    filterClick: React.PropTypes.func

  getInitialState: ->
    {}

  onLogin: ->
    channel.emit('launcher.clicked.login')
    @setState(openAs: 'login')
    undefined # stop react from complaining about returning false from a handler

  onEnroll: ->
    channel.emit('launcher.clicked.enroll')
    @setState(openAs: 'enroll')
    undefined # stop react from complaining about returning false from a handler

  render: ->
    {open, displayLauncher, filterClick} = @props
    coachProps = _.omit(@props, 'open')
    coachProps.openAs = @state.openAs

    modal = <CCModal filterClick={filterClick}>
      <ConceptCoach {...coachProps} />
    </CCModal> if open

    launcher = <Launcher
      isLaunching={open}
      onLogin={@onLogin}
      onEnroll={@onEnroll}
    /> if displayLauncher

    <div className='concept-coach-wrapper'>
      {launcher}
      {modal}
    </div>

module.exports = {Coach, channel}
