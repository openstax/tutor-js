# coffeelint: disable=max_line_length

_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'

api  = require '../api'

ERROR_MAP = {
  invalid_enrollment_code: 'The provided enrollment code is not valid. Please verify the enrollment code and try again.'
  enrollment_code_does_not_match_book: 'The provided enrollment code matches a course but not for the current book. ' +
                                       'Please verify the enrollment code and try again.'
  already_enrolled: 'You are already enrolled in this course. Please log in.'
  multiple_roles: 'We currently do not support teacher accounts with multiple associated student enrollments.'
  dropped_student: 'You have been dropped from this course. Please speak to your instructor to rejoin.'
  already_processed: 'Your enrollment in this course has been processed. Please reload the page.'
  already_approved: 'Your enrollment in this course has been approved. Please reload the page.'
  already_rejected: 'Your request to enroll in this course has been rejected for an unknown reason. Please contact OpenStax support.'
  taken: 'The provided student ID has already been used in this course. Please try again or contact your instructor.'
  blank_student_identifer: 'The student ID field cannot be left blank. Please enter your student ID.'
}


class Course

  constructor: (attributes) ->
    @channel = new EventEmitter2
    _.extend(@, attributes)
    _.bindAll(@, '_onRegistered', '_onConfirmed', '_onValidated', '_onStudentUpdated')

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
    "#{part.course.name} (section #{part.period.name})"

  teacherNames: ->
    part = @to or @
    return '' unless part.course?.teachers
    teachers = part.course.teachers
    names = _.map teachers, (teacher) ->
      teacher.name or "#{teacher.first_name} #{teacher.last_name}"
    # convert array to sentence
    if names.length > 1
      "Instructors: " + names.slice(0, names.length - 1).join(', ') + " and " + names.slice(-1)
    else
      "Instructor: " + _.first(names)

  getStudentIdentifier: ->
    @getStudentRecord()?.student_identifier

  getStudentRecord: ->
    # Currently the students listing only contains the current student
    # If that is ever extended then the bootstrap data will need to include
    # the current user's id so that the `students` array can be searched for it.
    @students = [{}] if _.isEmpty(@students)
    _.first(@students)

  hasErrors: ->
    not _.isEmpty(@errors)

  errorMessages: ->
    _.map @errors, (err) -> ERROR_MAP[err.code] or "An unknown error with code #{err.code} occured."

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
    payload.student_identifier = studentId if studentId
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
    @getStudentRecord().student_identifier = response.data.student_identifier
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

  _onStudentUpdated: (response) ->
    _.extend(@, response.data) if response?.data
    @getStudentRecord().student_identifier = response.data.student_identifier
    @channel.emit('change')

  updateStudentIdentifier: ( newIdentifier ) ->
    if _.isEmpty(newIdentifier)
      @errors = [{code: 'blank_student_identifer'}]
      @channel.emit('change')
    else
      @updateStudent(student_identifier: newIdentifier)

  updateStudent: (attributes) ->
    data = _.extend({}, attributes, id: @id)
    api.channel.once "course.#{@ecosystem_book_uuid}.receive.studentUpdate.*", @_onStudentUpdated
    api.channel.emit("course.#{@ecosystem_book_uuid}.send.studentUpdate", {data})

  _onRegistered: (response) ->
    throw new Error("response is empty in onRegistered") if _.isEmpty(response)
    {data} = response
    console.log data, response
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
