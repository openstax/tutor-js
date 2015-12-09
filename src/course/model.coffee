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
  taken: 'The Student ID is already a member'
}


class Course

  constructor: (attributes) ->
    @channel = new EventEmitter2
    _.extend(@, attributes)
    _.bindAll(@, '_onRegistered', '_onConfirmed')

  # complete and ready for use
  isRegistered: -> @id and not (@isIncomplete() or @isPending())
  # Freshly initialized, registration code has not been entered
  isIncomplete: -> not (@name or @to)
  # Has registration code, but not confimed
  isPending: ->    @status is "pending"

  # forget in-progress registration information.  Called when a join is canceled
  resetToBlankState: ->
    delete @to
    delete @name
    @channel.emit('change')

  description: ->
    if @isIncomplete() # still fetching
      ""
    else if @isPending() # we originated from a join or move request
      msg = @describeMovePart(@to)
      if @from then "from #{@describeMovePart(@from)} to #{msg}" else msg
    else
      "#{@name} #{_.first(@periods).name} period"

  describeMovePart: (part) ->
    return '' unless part
    "#{part.course.name} (#{part.period.name}) by #{@teacherNames(part)}"

  teacherNames: (part) ->
    teachers = part.course.teachers
    names = _.map teachers, (teacher) ->
      teacher.name or "#{teacher.first_name} #{teacher.last_name}"
    # convert array to sentence
    if names.length > 1
      names.slice(0, names.length - 1).join(', ') + " and " + names.slice(-1)
    else
      _.first(names)

  hasErrors: ->
    not _.isEmpty(@errors)

  errorMessages: ->
    _.map @errors, (err) -> ERROR_MAP[err.code]

  # When a course needs to be manipluated, it's cloned
  clone: ->
    new Course({ecosystem_book_uuid: @ecosystem_book_uuid})

  # The clone's attributes are persisted to the user once complete
  persist: (user) ->
    other = user.findOrCreateCourse(@ecosystem_book_uuid)
    _.extend(other, @to.course)
    other.periods = [ @to.period ]
    user.onCourseUpdate(other)

  # Submits pending course change for confirmation
  confirm: (studentId) ->
    payload = { id: @id }
    payload.student_identifier = studentId unless _.isEmpty(studentId)
    @isBusy = true
    api.channel.once "course.#{@id}.receive.confirmation.*", @_onConfirmed
    api.channel.emit("course.#{@id}.send.confirmation", data: payload)
    @channel.emit('change')

  _onConfirmed:  (response) ->
    {data} = response
    if data?.to
      _.extend(@, data.to.course)
      @periods = [ data.to.period ]
    @errors = data?.errors
    response.stopErrorDisplay = true if @errors
    delete @status unless @hasErrors() # blank status indicates good to go
    delete @isBusy
    @channel.emit('change')

  # Submits a course invite for registration
  register: (inviteCode) ->
    @isBusy = true
    api.channel.once "course.#{@ecosystem_book_uuid}.receive.registration.*", @_onRegistered
    api.channel.emit("course.#{@ecosystem_book_uuid}.send.registration", data: {
      book_uuid: @ecosystem_book_uuid, enrollment_code: inviteCode
    })
    @channel.emit('change')

  _onRegistered: (response) ->
    {data} = response
    _.extend(@, data)
    @errors = data.errors
    # a freshly registered course doesn't contain the is_concept_coach flag
    @is_concept_coach = true
    response.stopErrorDisplay = true if @errors
    delete @isBusy
    @channel.emit('change')


module.exports = Course
