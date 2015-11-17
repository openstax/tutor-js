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
  already_processed: 'The request has already been processed'
  already_approved: 'The request has already been proccessed'
  already_rejected: 'The request has already been rejected'
  taken: 'You are already a member of this course'
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
    status = if @isIncomplete() # still fetching
        ""
      else if @isPending() # we originated from a join request
        "#{@to.course.name} #{@to.period.name} period"
      else
        "#{@name} #{_.first(@periods).name} period"
      teachers = @teacherNames()
      if status and teachers
        "#{status} taught by #{teachers}"
      else
        status

  teacherNames: ->
    teachers = @teachers or @to?.course.teachers
    names = _.map teachers, (teacher) ->
      teacher.name or "#{teacher.first_name} #{teacher.last_name}"
    # convert array to sentence
    if names.length > 1
      names.slice(0, names.length - 1).join(', ') + " and " + names.slice(-1)
    else
      _.first(names)

  set: (attributes) ->
    _.extend(@, attributes)
    @channel.emit('change')

  hasErrors: ->
    not _.isEmpty(@errors)

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
    if data.to
      _.extend(@, data.to.course)
      @periods = [ data.to.period ]
    @errors = data.errors
    @user.onCourseUpdate(@)
    delete @status unless @hasErrors() # blank status indicates good to go
    @channel.emit('change')


  _onRegistered: ({data}) ->
    # confirmation has completed
    _.extend(@, data)
    @user.onCourseUpdate(@)
    @channel.emit('change')


module.exports = Course
