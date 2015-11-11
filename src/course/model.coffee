_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'

api  = require '../api'

ERROR_MAP = {
  invalid_enrollment_code: 'The enrollment code is invalid'
  enrollment_code_does_not_match_book: 'The enrollment code is invalid for this content'
  already_enrolled: 'You are already enrolled in this course'
  multiple_roles: 'You are listed as both  teacher and a student'
  dropped_student: 'Your account is  unable to participate at this time'
}


class Course

  constructor: (@user, attributes) ->
    @channel = new EventEmitter2
    @set(attributes)
    _.bindAll(@, '_onRegistered', '_onConfirmed')

  isRegistered: -> not (@isIncomplete() or @isPending())
  isIncomplete: -> not (@name or @to)
  isPending: ->    @status is "pending"
  cancelJoin: ->   @user.removeCourse(@)

  description: ->
    if @isIncomplete() # still fetching
      ""
    else if @isPending() # we originated from a join request
      "#{@to.course.name} #{@to.period.name} period"
    else
      "#{@name} #{_.first(@periods).name} period"


  set: (attributes) ->
    _.extend(@, attributes)
    @channel.emit('change')

  errorMessages: ->
    _.map @errors, (err) -> ERROR_MAP[err.code]

  register: (inviteCode) ->
    @errors = []
    api.channel.once "course.#{@ecosystem_book_uuid}.receive.registration.*", @_onRegistered
    api.channel.emit("course.#{@ecosystem_book_uuid}.send.registration", data: {
      book_uuid: @ecosystem_book_uuid, enrollment_code: inviteCode
    })

  confirm: ->
    api.channel.once "course.#{@id}.receive.confirmation.*", @_onConfirmed
    api.channel.emit("course.#{@id}.send.confirmation", data: { id: @id })

  _onConfirmed:  ({data}) ->
    _.extend(@, data.to.course)
    @periods = [ data.to.period ]
    @user.onCourseUpdate(@)
    delete @status # blank status indicates good to go
    @channel.emit('change')


  _onRegistered: ({data}) ->
    # confirmation has completed
    _.extend(@, data)
    @user.onCourseUpdate(@)
    @channel.emit('change')


module.exports = Course
