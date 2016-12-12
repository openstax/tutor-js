# coffeelint: disable=max_line_length

_ = require 'underscore'
React = require 'react'
flux = require 'flux-react'

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

  exports:
    # Still loading (creating the EnrollmentChange)
    isLoading: -> @enrollmentChange.status is "loading"

    # Errors
    isCreateError: -> @enrollmentChange.status is "create_error"
    isRegisterError: -> @enrollmentChange.status is "process_error"

    # A registration has been created, but it conflicts with a previous CC enrollment
    isConflicting: -> @enrollmentChange.status is "cc_conflict"

    # A registration has been created, but not confirmed
    isPending: -> @enrollmentChange.status is "pending"

    # complete and ready for use
    isRegistered: -> @enrollmentChange.status is "processed"

    getEnrollmentChangeId: -> @enrollmentChange.id

    getCourseId: -> @enrollmentChange.to?.course?.id

    getStudentIdentifier: -> @enrollmentChange.student_identifier or ''

    description: ->
      to_msg = CourseEnrollmentStore.describeMovePart(@enrollmentChange.to)
      if @enrollmentChange.from and (
        CourseEnrollmentStore.isConflicting() or CourseEnrollmentStore.isPending())
        "from #{CourseEnrollmentStore.describeMovePart(@enrollmentChange.from)} to #{to_msg}"
      else
        to_msg

    describeMovePart: (part) ->
      return '' unless part
      "#{part.course.name} (section #{part.period.name})"

    teacherNames: (part = @enrollmentChange.to) ->
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

    hasConflict: -> !!@enrollmentChange.conflict

    conflictDescription: -> CourseEnrollmentStore.describeMovePart(@enrollmentChange.conflict)

    conflictTeacherNames: -> CourseEnrollmentStore.teacherNames(@enrollmentChange.conflict)

    hasErrors: ->
      not _.isEmpty(@enrollmentChange.errors)

    errorMessages: ->
      _.map(@enrollmentChange.errors,
        (err) -> ERROR_MAP[err.code] or "An unknown error with code #{err.code} occured."
      )

  storeResponse: (response) ->
    return if _.isEmpty(response)
    @enrollmentChange = response

  # Creates an EnrollmentChange
  create: (enrollmentCode) ->
    @enrollmentChange = { status: "loading" }
    @isBusy = true
    @emit('change')

  created: (response) ->
    throw new Error("response is empty in created") if _.isEmpty(response)
    @storeResponse(response)

    if CourseEnrollmentStore.hasErrors()
      @enrollmentChange.status = "create_error"
    else if CourseEnrollmentStore.isPending() and CourseEnrollmentStore.hasConflict()
      @enrollmentChange.status = "cc_conflict"

    delete @isBusy
    @emit('change')

  # Approves a pending EnrollmentChange
  confirm: (id, studentId) ->
    @enrollmentChange.student_identifier = studentId
    @isBusy = true
    @emit('change')

  confirmed: (response) ->
    throw new Error("response is empty in confirmed") if _.isEmpty(response)
    @storeResponse(response)

    @enrollmentChange.status = "process_error" if CourseEnrollmentStore.hasErrors()

    @emit('change')

  conflictContinue: ->
    @enrollmentChange.status = "pending"
    @emit('change')

  FAILED: ->
    @isBusy = false
    @emit('change')


module.exports = {CourseEnrollmentActions, CourseEnrollmentStore}
