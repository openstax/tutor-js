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
  courses: []

User =
  isLoaded: false
  channel: new EventEmitter2 wildcard: true

  update: (data) ->
    _.extend(this, data.user)
    @courses = _.map data.courses, (course) => new Course(@, course)
    @channel.emit('change')

  logout: ->
    _.extend(this, BLANK_USER)
    @channel.emit('change')

  get: ->
    @

  getCourse: (collectionUUID) ->
    _.findWhere( @courses, ecosystem_book_uuid: collectionUUID )

  findOrCreateCourse: (collectionUUID) ->
    @getCourse(collectionUUID) or (
      course = new Course(@, ecosystem_book_uuid: collectionUUID)
      @courses.push(course)
      course
    )

  ensureStatusLoaded: ->
    api.channel.emit('user.status.send.fetch') unless @isLoggedIn()

  isLoggedIn: ->
    !!@profile_url

  onCourseUpdate: (course) ->
    @channel.emit('change')
  removeCourse: (course) ->
    index = @courses.indexOf(course)
    @courses.splice(index, 1) unless index is -1
    @channel.emit('change')

api.channel.on 'user.status.receive.*', ({data}) ->
  User.isLoaded = true
  User.update(loaded: true)
  if data.access_token
    api.channel.emit('set.access_token', data.access_token)
  User.endpoints = data.endpoints
  if data.user then User.update(data) else User.logout()

# start out as a blank user
_.extend(User, BLANK_USER)


module.exports = User
