User = require './model'

UserStatusMixin = {

  componentDidMount: ->
    User.channel.on("change", @onUserChange)
  componentWillUnmount: ->
    User.channel.off("change", @onUserChange)
  onUserChange: ->
    @forceUpdate() if @isMounted()
  getUser: ->
    User
}

module.exports = UserStatusMixin
