User = require './model'
Course = require '../course/model'

UserStatusMixin = {

  componentDidMount: ->
    User.channel.on("change", @onUserChange)
  componentWillUnmount: ->
    User.channel.off("change", @onUserChange)
  onUserChange: ->
    @forceUpdate()
  getUser: ->
    User
  getCourse: ->
    @props.course or
      User.getCourse(@props.collectionUUID) or
      new Course({ecosystem_book_uuid: @props.collectionUUID})
}

module.exports = UserStatusMixin
