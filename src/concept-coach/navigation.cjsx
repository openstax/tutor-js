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

  update: ->
    @forceUpdate() if @isMounted()

  showProfile: ->
    channel.emit('show.task', {view: 'task'})

  showProgress: ->
    channel.emit('show.progress', {view: 'dashboard'})

  close: ->
    channel.emit('close.clicked')
    @props.close?()

  handleSelect: (selectedKey) ->
    @[selectedKey]?()

  render: ->
    status = if user.isLoggedIn() then "logged in as #{user.name}" else 'an unknown user'
    brand = [
      <strong>Concept</strong>
      'Coach'
    ]
    <BS.Navbar brand={brand} fixedTop fluid>
      <BS.CollapsibleNav eventKey={0}>
        <BS.Nav navbar>
        </BS.Nav>
        <BS.Nav right navbar activeKey={1} onSelect={@handleSelect}>
          <BS.NavItem
            eventKey='showProfile'
            className='concept-coach-user'>
            {user.name}
          </BS.NavItem>
          <BS.NavItem
            eventKey='showProgress'
            className='concept-coach-dashboard-button'>
            My Progress
          </BS.NavItem>
          <BS.NavItem
            eventKey='close'>
            <CloseButton/>
          </BS.NavItem>
        </BS.Nav>
      </BS.CollapsibleNav>
    </BS.Navbar>


module.exports = {Navigation}
