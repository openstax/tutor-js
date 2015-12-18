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

  getInitialState: ->
    {open} = @props
    isOpen: open

  componentWillReceiveProps: (nextProps) ->
    {open} = nextProps
    @setState(isOpen: open) if open isnt @state.isOpen

  render: ->
    {isOpen} = @state
    {displayLauncher} = @props
    coachProps = _.omit(@props, 'open')

    modal = <CCModal>
      <ConceptCoach {...coachProps}/>
    </CCModal> if isOpen

    launcher = <Launcher/> if displayLauncher

    <div className='concept-coach-wrapper'>
      {launcher}
      {modal}
    </div>

module.exports = {Coach, channel}
