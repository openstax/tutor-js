_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'

api = require '../api'

BLANK_USER =
  is_admin: false
  is_content_analyst: false
  is_customer_service: false
  name: null
  profile_url: null
  loaded: false

User =

  channel: new EventEmitter2 wildcard: true

  update: (data) ->
    data.loaded = true
    _.extend(this, data)
    @channel.emit('change')

  logout: ->
    _.extend(this, BLANK_USER)
    @channel.emit('change')

  ensureStatusLoaded: ->
    api.channel.emit("user.send.statusUpdate") unless @isLoggedIn()

  isLoggedIn: -> !!@profile_url

api.channel.on 'user.receive.*', ({data}) ->
  if data.access_token
    api.channel.emit('set.access_token', data.access_token)
  User.endpoints = data.endpoints
  if data.current_user then User.update(data.current_user) else User.logout()

# start out as a blank user
_.extend(User, BLANK_USER)


module.exports = User
