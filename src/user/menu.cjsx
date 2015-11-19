React = require 'react'
BS = require 'react-bootstrap'
{CloseButton} = require 'openstax-react-components'

Status = require './status-mixin'

navigation = require '../navigation/model'

Course = require '../course/model'

api = require '../api'

getWaitingText = (status) ->
  "#{status}…"

UserMenu = React.createClass
  mixins: [Status]

  propTypes:
    close: React.PropTypes.func
    course: React.PropTypes.instanceOf(Course)

  componentWillMount: ->
    @getUser().ensureStatusLoaded()

  logoutUser: ->
    @getUser().logout()

  showProfile: (clickEvent) ->
    clickEvent.preventDefault()
    navigation.channel.emit('show.profile', view: 'profile')

  update: ->
    @forceUpdate() if @isMounted()

  close: (clickEvent) ->
    clickEvent.preventDefault()
    @props.close?()

  modifyCourse: ->
    navigation.channel.emit('show.panel', view: 'registration')

  renderCourseOption: ->
    <BS.MenuItem onClick={@modifyCourse}>Change Course and ID</BS.MenuItem>

  render: ->
    # The menu has no valid actions unless the useris logged in
    user = @getUser()
    return null unless user.isLoggedIn()
    <BS.DropdownButton navItem className='concept-coach-user' title={user.name}>
      {@renderCourseOption() if @props.course?.isRegistered()}
      <BS.MenuItem onClick={@showProfile}>Account Profile</BS.MenuItem>
      <BS.MenuItem onClick={@logoutUser}>Logout</BS.MenuItem>
    </BS.DropdownButton>

module.exports = UserMenu
