# coffeelint: disable=max_line_length

_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'

ERROR_MAP = require './course-enrollment-handled-errors'

CourseEnrollmentActions = flux.createActions [
  'create'
  'created'
  'approve'
  'approved'
  'FAILED'
]

CourseEnrollmentStore = flux.createStore
  actions: _.values(CourseEnrollmentActions)
  status: "loading"

  exports:
    # Still loading (creating the EnrollmentChange)
    isLoading: -> @status is "loading"

    # A registration has been created, but not confirmed
    isPending: -> @status is "pending"

    # complete and ready for use
    isRegistered: -> @status is "approved"

    getStudentIdentifier: -> ""

    courseId: -> @to.course?.id

    confirm: (studentId) -> CourseEnrollmentActions.approve(@id, studentId)

    description: ->
      msg = @exports.describeMovePart(@to)
      if @from and @exports.isPending()
        "from #{@exports.describeMovePart(@from)} to #{msg}"
      else
        msg

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
      _.map(@errors,
        (err) -> ERROR_MAP[err.code] or "An unknown error with code #{err.code} occured."
      )

  _checkForFailure: (response) ->
    @errors = response.errors

  # Creates an EnrollmentChange
  create: (enrollmentCode) ->
    @status = "loading"
    @isBusy = true
    @emit('changed')

  created: (response) ->
    throw new Error("response is empty in onCreate") if _.isEmpty(response)
    @_checkForFailure(response)

    _.extend(@, response) if response and not @exports.hasErrors()
    delete @isBusy
    @emit('changed')

  # Approves a pending EnrollmentChange
  approve: (studentId) ->
    @isBusy = true
    @emit('changed')

  approved: (response) ->
    throw new Error("response is empty in onApproved") if _.isEmpty(response)
    @_checkForFailure(response)

    @status = "approved" unless @exports.hasErrors()
    @emit('changed')

  FAILED: ->
    @isBusy = false
    @emit('changed')


module.exports = {CourseEnrollmentActions, CourseEnrollmentStore}
