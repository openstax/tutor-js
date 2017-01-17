User = require './model'
Course = require '../course/model'
pick = require 'lodash/pick'

UserStatusMixin = {

  componentDidMount: ->
    User.channel.on("change", @onUserChange)
  componentWillUnmount: ->
    User.channel.off("change", @onUserChange)
  onUserChange: ->
    @_onUserChange?() or @forceUpdate()
  getUser: ->
    User
  getCourse: ->
    otherOptions = pick(@props, 'secondSemester')

    @props.course or
      User.getCourse(@props.collectionUUID, @props.enrollmentCode, otherOptions) or
      new Course({ecosystem_book_uuid: @props.collectionUUID})
}

module.exports = UserStatusMixin
