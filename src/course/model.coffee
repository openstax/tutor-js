_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'

api = require '../api'

ERROR_MAP = {
  invalid_enrollment_code: 'The enrollment code is invalid'
  enrollment_code_does_not_match_book: 'The enrollment code is invalid for this content'
  already_enrolled: 'You are already enrolled in this course'
  multiple_roles: 'You are listed as both  teacher and a student'
  dropped_student: 'Your account is  unable to participate at this time'
}


class Course

  constructor: (attributes) ->
    @channel = new EventEmitter2
    @set(attributes)
    api.channel.on "course.#{@ecosystem_book_uuid}.registration.complete", ({data}) =>
      _.extend(this, data)

    api.channel.on "course.#{@ecosystem_book_uuid}.registration.failure", ({data}) =>
      _.extend(@, data)
      @channel.emit('change')

  set: (attributes) ->
    _.extend(@, attributes)
    @channel.emit('change')

  errorMessages: ->
    _.map @errors, (err) -> ERROR_MAP[err.code]

  register: (inviteCode) ->
    @errors = []
    api.channel.emit("course.#{@ecosystem_book_uuid}.send.registration", data: {
      book_cnx_id: @ecosystem_book_uuid, enrollment_code: inviteCode
    })



module.exports = Course
