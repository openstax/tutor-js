React = require 'react'
BS = require 'react-bootstrap'
EventEmitter2 = require 'eventemitter2'
{CloseButton} = require 'openstax-react-components'

Status = require './status-mixin'

Course = require '../course/model'

api = require '../api'

getWaitingText = (status) ->
  "#{status}…"

UserMenu = React.createClass
  mixins: [Status]

  contextTypes:
    close: React.PropTypes.func
    navigator: React.PropTypes.instanceOf(EventEmitter2)

  propTypes:
    course: React.PropTypes.instanceOf(Course)

  componentWillMount: ->
    @getUser().ensureStatusLoaded()

  logoutUser: ->
    @getUser().logout()

  showProfile: (clickEvent) ->
    clickEvent.preventDefault()
    @context.navigator.emit('show.profile', view: 'profile')

  update: ->
    @forceUpdate() if @isMounted()

  close: (clickEvent) ->
    clickEvent.preventDefault()
    @context.close?()

  modifyCourse: (clickEvent) ->
    clickEvent.preventDefault()
    @context.navigator.emit('show.registration', view: 'registration')

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
