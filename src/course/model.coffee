_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'

api = require '../api'

channel = new EventEmitter2 wildcard: true

class Course

  constructor: (@collectionUUID) ->
    api.channel.on "course.#{@collectionUUID}.registration.complete", ({data}) =>
      _.extend(this, data)

  register: (inviteCode) ->
    api.channel.emit("course.#{@collectionUUID}.send.registration")
