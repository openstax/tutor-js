React = require 'react'
BS = require 'react-bootstrap'
{CloseButton} = require 'openstax-react-components'

Status = require './status-mixin'

Coach = require '../concept-coach/model'

api = require '../api'

getWaitingText = (status) ->
  "#{status}…"

UserMenu = React.createClass
  mixins: [Status]

  propTypes:
    close: React.PropTypes.func

  componentWillMount: ->
    @getUser().ensureStatusLoaded()

  logoutUser: ->
    @getUser().logout()

  showProfile: ->
    Coach.channel.emit('show.panel', view: 'profile')

  update: ->
    @forceUpdate() if @isMounted()

  close: (clickEvent) ->
    clickEvent.preventDefault()
    @props.close?()

  render: ->
    # The menu has no valid actions unless the useris logged in
    user = @getUser()
    return null unless user.isLoggedIn()

    <BS.DropdownButton navItem className='concept-coach-user' title={user.name}>
      <BS.MenuItem onClick={@showProfile}>Account Profile</BS.MenuItem>
      <BS.MenuItem onClick={@logoutUser}>Logout</BS.MenuItem>
    </BS.DropdownButton>

module.exports = UserMenu
