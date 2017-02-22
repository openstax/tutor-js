# coffeelint: disable=max_line_length

_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'
# TODO pull out time helper from tutor to shared.
moment = require 'moment'

api  = require '../api'

ERROR_MAP = require './handled-errors'


class Course

  constructor: (attributes) ->
    @channel = new EventEmitter2(wildcard: true)
    _.extend(@, attributes)
    _.bindAll(@, '_onRegistered', '_onConfirmed', '_onValidated', '_onStudentUpdated')

  prepForSecondSemesterEnrollment: ->
    @resetToBlankState()
    @secondSemester = true

  # complete and ready for use
  isRegistered: -> @id and not (@isIncomplete() or @isPending())
  # Freshly initialized, registration code has not been entered
  isIncomplete: -> not (@name or @to)
  # The registration code has been validated but sign-up is not yet started
  isValidated: -> @status is "validated"
  # Conflicts with a previous CC enrollment
  isConflicting: -> @status is "cc_conflict"
  # A registration has been created, but not confirmed
  isPending: -> @status is "pending"
  # the course exists but the user has indicated that
  # they're going to be taking the second semester of it
  isSecondSemester: -> @secondSemester is true
  getEnrollmentChangeId: -> @id if @isPending()

  # forget in-progress registration information.  Called when a join is canceled
  resetToBlankState: ->
    delete @to
    delete @name
    @channel.emit('change')

  getRole: ->
    _.first @roles

  getEnrollmentCode: ->
    _.first(@periods).enrollment_code

  getWhen: ->
    currentDay = moment()
    return false unless (@starts_at and @ends_at)

    startDate = moment(@starts_at)
    endDate = moment(@ends_at)

    if endDate.isBefore(currentDay, 'day')
      'past'
    else if startDate.isAfter(currentDay, 'day')
      'future'
    else if @is_active
      'current'
    else
      false

  description: ->
    if @isIncomplete() # still fetching
      ""
    else if @isConflicting() or @isPending() # we originated from a join or move request
      msg = @describeMovePart(@to)
      if @from then "from #{@describeMovePart(@from)} to #{msg}" else msg
    else
      "#{@name} #{_.first(@periods).name}"

  describeMovePart: (part) ->
    return '' unless part
    "#{part.course.name} (section #{part.period.name})"

  teacherNames: (part = @to or @) ->
    return '' unless part.course?.teachers
    teachers = part.course.teachers
    names = _.map teachers, (teacher) ->
      teacher.name or "#{teacher.first_name} #{teacher.last_name}"
    # convert array to sentence
    if names.length > 1
      "Instructors: " + names.slice(0, names.length - 1).join(', ') + " and " + names.slice(-1)
    else
      "Instructor: " + _.first(names)

  hasConflict: -> !!@conflict

  conflictDescription: -> @describeMovePart(@conflict)

  conflictTeacherNames: -> @teacherNames(@conflict)

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

  # When a course needs to be manipulated, it's cloned
  clone: ->
    new Course({ecosystem_book_uuid: @ecosystem_book_uuid})

  # The clone's attributes are persisted to the user once complete
  persist: (user, changeEvent) ->
    other = user.findOrCreateCourse(@ecosystem_book_uuid, @enrollmentCode)
    _.extend(other, @to?.course)
    other.status = @status
    other.enrollment_code = @enrollment_code
    other.periods = [ @to?.period ]
    user.onCourseUpdate(other, changeEvent)

  _checkForFailure: (error) ->
    @errors = error.response?.data?.errors

  _onValidated: (response) ->
    hasErrors = @_checkForFailure(response)
    {data} = response
    delete @isBusy
    if hasErrors
      @channel.emit('validated.failure', hasErrors)
    else
      @status = 'validated'
      @channel.emit('validated.success', data)
    @channel.emit('change')

  # Submits pending course change for confirmation
  confirm: (id, studentId) ->
    payload = { id: @id }
    payload.student_identifier = studentId if studentId
    @isBusy = true
    api.channel.once "course.#{@id}.confirmation.receive.*", @_onConfirmed
    api.channel.emit("course.#{@id}.confirmation.send", payload, payload)
    @channel.emit('change')

  _onConfirmed:  (response) ->
    throw new Error("response is empty in onConfirmed") if _.isEmpty(response)
    @_checkForFailure(response)

    {data} = response
    if data?.to
      _.extend(@, data.to.course)
      @periods = [ data.to.period ]

    @getStudentRecord().student_identifier = response.data.student_identifier

    delete @status unless @hasErrors() # blank status indicates good to go
    delete @isBusy
    @channel.emit('change', justConfirmed: true)

  validate: (enrollment_code) ->
    @enrollment_code = enrollment_code
    book_uuid = @ecosystem_book_uuid
    data = {enrollment_code, book_uuid}
    @isBusy = true
    api.channel.once "course.#{@ecosystem_book_uuid}.prevalidation.receive.*", @_onValidated
    api.channel.emit("course.#{@ecosystem_book_uuid}.prevalidation.send", {book_uuid}, data)

  # Submits a course invite for registration.  If user is signed in
  # the registration will be saved, otherwise it will only be validated
  register: (enrollment_code, user) ->
    @enrollment_code = enrollment_code
    book_uuid = @ecosystem_book_uuid
    data = {enrollment_code, book_uuid}
    @isBusy = true
    if user.isLoggedIn()
      api.channel.once "course.#{@ecosystem_book_uuid}.registration.receive.*", @_onRegistered
      api.channel.emit("course.#{@ecosystem_book_uuid}.registration.send", {book_uuid}, data)
    else
      @validate(enrollment_code)
    @channel.emit('change')

  _onStudentUpdated: (response) ->
    _.extend(@, response.data) if response?.data
    @getStudentRecord().student_identifier = response.data.student_identifier
    @channel.emit('change')

  updateStudentIdentifier: ( newIdentifier ) ->
    if _.isEmpty(newIdentifier)
      @errors = [{code: 'blank_student_identifier'}]
      @channel.emit('change')
    else if newIdentifier is @getStudentIdentifier()
      @errors = [{code: 'no_change'}]
      @channel.emit('change')
    else
      @updateStudent(student_identifier: newIdentifier)

  updateStudent: (attributes) ->
    data = _.extend({}, attributes, id: @id)
    api.channel.once "course.#{@ecosystem_book_uuid}.studentUpdate.receive.*", @_onStudentUpdated
    api.channel.emit("course.#{@ecosystem_book_uuid}.studentUpdate.send", data, data)

  _onRegistered: (response) ->
    throw new Error("response is empty in onRegistered") if _.isEmpty(response)
    @_checkForFailure(response)

    {data} = response
    _.extend(@, data) if data
    @status = "cc_conflict" if @status is "pending" and @conflict
    # a freshly registered course doesn't contain the is_concept_coach flag
    @is_concept_coach = true
    delete @isBusy
    @channel.emit('change')

  conflictContinue: ->
    @status = "pending"
    @channel.emit('change')

  destroy: ->
    @channel.emit('destroy')
    @channel.removeAllListeners()


module.exports = Course
