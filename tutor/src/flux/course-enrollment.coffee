# coffeelint: disable=max_line_length

_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'

ERROR_MAP = require './course-enrollment-handled-errors'

CourseEnrollmentActions = flux.createActions [
  'create'
  'created'
  'confirm'
  'confirmed'
  'conflictContinue'
  'FAILED'
]

CourseEnrollmentStore = flux.createStore
  actions: _.values(CourseEnrollmentActions)
  status: "loading"
  studentId: ""

  exports:
    # Still loading (creating the EnrollmentChange)
    isLoading: -> @status is "loading"

    # Errors
    isCreateError: -> @status is "create_error"
    isApproveError: -> @status is "approve_error"

    # A registration has been created, but it conflicts with a previous CC enrollment
    isConflicting: -> @status is "cc_conflict"

    # A registration has been created, but not confirmed
    isPending: -> @status is "pending"

    # complete and ready for use
    isRegistered: -> @status is "approved"

    getEnrollmentChangeId: -> @id

    getCourseId: -> @to?.course?.id

    getStudentIdentifier: -> @studentId

    description: ->
      msg = CourseEnrollmentStore.describeMovePart(@to)
      if @from and CourseEnrollmentStore.isPending()
        "from #{CourseEnrollmentStore.describeMovePart(@from)} to #{msg}"
      else
        msg

    describeMovePart: (part) ->
      return '' unless part
      "#{part.course.name} (section #{part.period.name})"

    teacherNames: (part = @to) ->
      teachers = part.course?.teachers
      return '' unless teachers

      names = _.map teachers, (teacher) ->
        teacher.name or "#{teacher.first_name} #{teacher.last_name}"

      # convert array to sentence
      if names.length == 0
        ""
      else if names.length == 1
        "Instructor: " + _.first(names)
      else
        "Instructors: " + names.slice(0, names.length - 1).join(', ') + " and " + names.slice(-1)

    hasConflict: -> !!@conflict

    conflictDescription: -> CourseEnrollmentStore.describeMovePart(@conflict)

    conflictTeacherNames: -> CourseEnrollmentStore.teacherNames(@conflict)

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

    if CourseEnrollmentStore.hasErrors()
      @status = "create_error"
    else
      _.extend(@, response) if response
      @status = "cc_conflict" if @status is "pending" and @conflict
    delete @isBusy
    @emit('changed')

  # Approves a pending EnrollmentChange
  confirm: (id, studentId) ->
    @studentId = studentId
    @isBusy = true
    @emit('changed')

  confirmed: (response) ->
    throw new Error("response is empty in onApproved") if _.isEmpty(response)
    @_checkForFailure(response)
    if CourseEnrollmentStore.hasErrors()
      @status = "approve_error"
    else
      @status = "approved"
    @emit('changed')

  conflictContinue: ->
    @status = "pending"
    @emit('changed')

  FAILED: ->
    @isBusy = false
    @emit('changed')


module.exports = {CourseEnrollmentActions, CourseEnrollmentStore}
