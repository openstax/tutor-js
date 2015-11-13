React = require 'react'
BS = require 'react-bootstrap'
{CloseButton} = require 'openstax-react-components'

Status = require './status-mixin'

User = require './model'
Coach = require '../concept-coach/model'

api = require '../api'

getWaitingText = (status) ->
  "#{status}…"

UserMenu = React.createClass
  mixins: [Status]

  propTypes:
    close: React.PropTypes.func

  componentWillMount: ->
    User.ensureStatusLoaded()
    User.channel.on("change", @update)

  componentWillUnmount: ->
    User.channel.off("change", @update)

  logoutUser: ->
    User.logout()

  showProfile: ->
    Coach.channel.emit('show.panel', view: 'profile')

  update: ->
    @forceUpdate() if @isMounted()

  close: (clickEvent) ->
    clickEvent.preventDefault()
    @props.close?()

  render: ->
    # The menu has no valid actions unless the useris logged in
    return null unless User.isLoggedIn()

    <BS.DropdownButton navItem className='concept-coach-user' title={User.name}>
      <BS.MenuItem onClick={@showProfile}>Account Profile</BS.MenuItem>
      <BS.MenuItem onClick={@logoutUser}>Logout</BS.MenuItem>
    </BS.DropdownButton>



    # brand = [
    #   <strong>Concept</strong>
    #   'Coach'
    # ]

    # <BS.Navbar brand={brand} fixedTop fluid>
    #   <BS.CollapsibleNav eventKey={0}>
    #     <BS.Nav navbar>
    #     </BS.Nav>
    #     <BS.Nav right navbar>
    #       <BS.NavItem className='concept-coach-user'>
    #         {user.name}
    #       </BS.NavItem>
    #       {@renderLogout()}
    #       <BS.NavItem onClick={@close}>
    #         <CloseButton/>
    #       </BS.NavItem>
    #     </BS.Nav>
    #   </BS.CollapsibleNav>
    # </BS.Navbar>


module.exports = UserMenu
