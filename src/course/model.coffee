_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'

api = require '../api'

channel = new EventEmitter2 wildcard: true

class Course

  constructor: (attributes) ->
    _.extend(@, attributes)

    api.channel.on "course.#{@ecosystem_book_uuid}.registration.complete", ({data}) =>
      _.extend(this, data)

  register: (inviteCode) ->
    api.channel.emit("course.#{@ecosystem_book_uuid}.send.registration", data: {
      book_cnx_id: @ecosystem_book_uuid, enrollment_code: inviteCode
    })

module.exports = Course
