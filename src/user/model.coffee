_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'
Course = require '../course/model'
api = require '../api'

BLANK_USER =
  is_admin: false
  is_content_analyst: false
  is_customer_service: false
  name: null
  profile_url: null

User =

  channel: new EventEmitter2 wildcard: true

  update: (data) ->
    _.extend(this, data.user)
    @courses = _.map data.courses, (course) -> new Course(course)
    @channel.emit('change')

  logout: ->
    _.extend(this, BLANK_USER)
    @channel.emit('change')

  getCourse: (collectionUUID) ->
    _.findWhere @courses, ecosystem_book_uuid: collectionUUID

  ensureStatusLoaded: ->
    api.channel.emit("user.send.statusUpdate") unless @isLoggedIn()

  isLoggedIn: -> !!@profile_url

api.channel.on 'user.receive.*', ({data}) ->
  User.update(loaded: true)
  if data.access_token
    api.channel.emit('set.access_token', data.access_token)
  User.endpoints = data.endpoints
  if data.user then User.update(data.user) else User.logout()

# start out as a blank user
_.extend(User, BLANK_USER)


module.exports = User
