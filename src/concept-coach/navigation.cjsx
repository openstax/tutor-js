React = require 'react'
BS = require 'react-bootstrap'
{CloseButton} = require 'openstax-react-components'

user = require '../user/model'
{channel} = require './model'
api = require '../api'

Navigation = React.createClass
  displayName: 'Navigation'

  propTypes:
    close: React.PropTypes.func

  componentWillMount: ->
    user.ensureStatusLoaded()
    user.channel.on("change", @update)

  componentWillUnmount: ->
    user.channel.off("change", @update)

  getInitialState: ->
    active: ''

  update: ->
    @forceUpdate() if @isMounted()

  showProfile: ->
    channel.emit('show.profile', {view: 'profile'})

  showExercise: ->
    channel.emit('show.task', {view: 'task'})

  showProgress: ->
    channel.emit('show.progress', {view: 'dashboard'})

  close: ->
    channel.emit('close.clicked')
    @props.close?()

  handleSelect: (selectedKey) ->
    @setState(active: selectedKey)
    @[selectedKey]?()

  render: ->
    {active} = @state

    brand = [
      <strong>Concept</strong>
      'Coach'
    ]

    navigationItems = [
      <BS.NavItem
        eventKey='showProfile'
        className='concept-coach-user'>
        {user.name}
      </BS.NavItem>
      <BS.NavItem
        eventKey='showExercise'
        className='concept-coach-exercise-nav'>
        Exercise
      </BS.NavItem>
      <BS.NavItem
        eventKey='showProgress'
        className='concept-coach-dashboard-nav'>
        My Progress
      </BS.NavItem>
    ] if user.isLoggedIn()

    <BS.Navbar brand={brand} fixedTop fluid>
      <BS.CollapsibleNav eventKey={0}>
        <BS.Nav navbar>
        </BS.Nav>
        <BS.Nav right navbar activeKey={active} onSelect={@handleSelect}>
          {navigationItems}
          <BS.NavItem
            eventKey='close'>
            <CloseButton/>
          </BS.NavItem>
        </BS.Nav>
      </BS.CollapsibleNav>
    </BS.Navbar>


module.exports = {Navigation}
