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

  render: ->
    {open} = @props
    {displayLauncher} = @props
    coachProps = _.omit(@props, 'open')

    modal = <CCModal>
      <ConceptCoach {...coachProps}/>
    </CCModal> if open

    launcher = <Launcher isLaunching={open}/> if displayLauncher

    <div className='concept-coach-wrapper'>
      {launcher}
      {modal}
    </div>

module.exports = {Coach, channel}
