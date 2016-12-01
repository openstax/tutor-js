# coffeelint: disable=max_line_length

_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'

api  = require '../api'

ERROR_MAP = require './handled-errors'


class CourseEnrollment

  constructor: (enrollmentCode) ->
    @channel = new EventEmitter2
    @enrollmentCode = enrollmentCode
    _.bindAll(@, '_onCreate', '_onApprove')

  # complete and ready for use
  isRegistered: -> @id and not @isPending()

  # A registration has been created, but not confirmed
  isPending: -> @status is "pending"

  courseId: -> @to.course?.id

  description: ->
    if @isPending() # we originated from a join request
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

  hasErrors: ->
    not _.isEmpty(@errors)

  errorMessages: ->
    _.map @errors, (err) -> ERROR_MAP[err.code] or "An unknown error with code #{err.code} occured."

  _checkForFailure: (error) ->
    @errors = error.response?.data?.errors

  # Creates an EnrollmentChange
  create: (enrollment_code, user) ->
    @enrollment_code = enrollment_code
    payload = { enrollment_code: enrollment_code }
    @isBusy = true
    api.channel.once "enroll.create.receive.*", @_onCreate
    api.channel.emit("enroll.create.send", payload, payload)
    @channel.emit('change')

  _onCreate: (response) ->
    throw new Error("response is empty in onCreate") if _.isEmpty(response)
    @_checkForFailure(response)

    {data} = response
    _.extend(@, data) if data
    delete @isBusy
    @channel.emit('change')

  # Approves a pending EnrollmentChange
  approve: (studentId) ->
    payload = { id: @id }
    payload.student_identifier = studentId if studentId
    @isBusy = true
    api.channel.once "enroll.#{@id}.approve.receive.*", @_onApprove
    api.channel.emit("enroll.#{@id}.approve.send", payload, payload)
    @channel.emit('change')

  _onApprove: (response) ->
    throw new Error("response is empty in onApproved") if _.isEmpty(response)
    @_checkForFailure(response)

    @status = "approved" unless @hasErrors()
    @channel.emit('change')

  destroy: ->
    @channel.emit('destroy')
    @channel.removeAllListeners()


module.exports = CourseEnrollment
