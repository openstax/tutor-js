# coffeelint: disable=max_line_length

_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'

api  = require '../api'

ERROR_MAP = {
  invalid_enrollment_code: 'This is not a valid enrollment code for this book. Please try again. Contact your instructor to verify your enrollment code.'
  enrollment_code_does_not_match_book: 'The enrollment code is invalid for this content'
  already_enrolled: 'You are already enrolled in this course'
  multiple_roles: 'You are listed as both  teacher and a student'
  dropped_student: 'Your account is  unable to participate at this time'
  already_processed: 'The request has already been processed'
  already_approved: 'The request has already been approved'
  already_rejected: 'The request has been rejected'
  taken: 'The Student ID is already a member'
}


class Course

  constructor: (attributes) ->
    @channel = new EventEmitter2
    _.extend(@, attributes)
    _.bindAll(@, '_onRegistered', '_onConfirmed', '_onValidated')

  # complete and ready for use
  isRegistered: -> @id and not (@isIncomplete() or @isPending())
  # Freshly initialized, registration code has not been entered
  isIncomplete: -> not (@name or @to)
  # The registration code has been validated but sign-up is not yet started
  isValidated: -> @status is "validated"
  # A registration has been created, but not confimed
  isPending: ->  @status is "pending"

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
      "#{@name} #{_.first(@periods).name}"

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
    _.extend(other, @to?.course)
    other.status = @status
    other.enrollment_code = @enrollment_code
    other.periods = [ @to?.period ]
    user.onCourseUpdate(other)

  _onValidated: (response) ->
    {data} = response
    delete @isBusy
    @errors = data?.errors
    response.stopErrorDisplay = true if @errors
    @status = 'validated' if data?.response is true
    @channel.emit('change')

  # Submits pending course change for confirmation
  confirm: (studentId) ->
    payload = { id: @id }
    payload.student_identifier = studentId unless _.isEmpty(studentId)
    @isBusy = true
    api.channel.once "course.#{@id}.receive.confirmation.*", @_onConfirmed
    api.channel.emit("course.#{@id}.send.confirmation", data: payload)
    @channel.emit('change')

  _onConfirmed:  (response) ->
    throw new Error("response is empty in onConfirmed") if _.isEmpty(response)
    {data} = response
    if data?.to
      _.extend(@, data.to.course)
      @periods = [ data.to.period ]
    @errors = data?.errors
    response.stopErrorDisplay = true if @errors
    delete @status unless @hasErrors() # blank status indicates good to go
    delete @isBusy
    @channel.emit('change')

  # Submits a course invite for registration.  If user is signed in
  # the registration will be saved, otherwise it will only be vaidated
  register: (enrollment_code, user) ->
    @enrollment_code = enrollment_code
    data = {enrollment_code, book_uuid: @ecosystem_book_uuid}
    @isBusy = true
    if user.isLoggedIn()
      api.channel.once "course.#{@ecosystem_book_uuid}.receive.registration.*", @_onRegistered
      api.channel.emit("course.#{@ecosystem_book_uuid}.send.registration", {data})
    else
      api.channel.once "course.#{@ecosystem_book_uuid}.receive.prevalidation.*", @_onValidated
      api.channel.emit("course.#{@ecosystem_book_uuid}.send.prevalidation", {data})
    @channel.emit('change')

  _onRegistered: (response) ->
    throw new Error("response is empty in onRegistered") if _.isEmpty(response)
    {data} = response
    _.extend(@, data) if data
    @errors = data?.errors
    # a freshly registered course doesn't contain the is_concept_coach flag
    @is_concept_coach = true
    response.stopErrorDisplay = true if @errors
    delete @isBusy
    @channel.emit('change')

  destroy: ->
    @channel.emit('destroy')
    @channel.removeAllListeners()


module.exports = Course
