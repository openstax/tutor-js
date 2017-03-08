_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'
Course = require '../course/model'
api = require '../api'

{BootstrapURLs, NotificationActions, UiSettings, ExerciseHelpers}  = require 'shared'

BLANK_USER =
  is_admin: false
  is_content_analyst: false
  is_customer_service: false
  name: null
  profile_url: null
  courses: []
  _course_data: []
  isLoaded: false
  isLoggingOut: false
  isLoading: false

User =
  channel: new EventEmitter2 wildcard: true

  update: (data) ->
    _.extend(this, data.user)
    @_course_data = data.courses
    pending = @validatedPendingCourses()
    @courses = _.compact _.map data.courses, (course) ->
      if course.is_concept_coach and _.detect(course.roles, (role) -> role.type is 'student')
        new Course(course)
    _.each pending, (course) =>
      @courses.push(course)
      course.register(course.enrollment_code, @)

    @channel.emit('change')

  # for use by specs
  _reset: ->
    @_course_data = []
    @courses = []
    delete @profile_url

  validatedPendingCourses: ->
    _.filter @courses, (course) -> course.isValidated()

  isTeacherForCourse: (collectionUUID) ->
    course = _.findWhere @_course_data, ecosystem_book_uuid: collectionUUID
    course and _.detect(course.roles, (role) -> role.type is 'teacher')

  status: (collectionUUID, enrollmentCode) ->
    course = @getCourse(collectionUUID, enrollmentCode)

    isLoggedIn: @isLoggedIn()
    isLoaded:   @isLoaded
    isRegistered: !!course?.isRegistered()
    preValidate: (not @isLoggedIn()) and (not course?.isValidated())

  isEnrolled: (collectionUUID, enrollmentCode) ->
    Boolean(@isLoggedIn() and @getCourse(collectionUUID, enrollmentCode))

  getCourse: (collectionUUID, enrollmentCode, options) ->
    initialFilter = _.extend(ecosystem_book_uuid: collectionUUID, options)
    filterForEcosystem = _.partial(_.where, _, initialFilter)
    sortyByJoinedAt = _.partial(_.sortBy, _, (course) -> course.getRole()?.latest_enrollment_at or '')
    operations = [filterForEcosystem]

    if enrollmentCode
      filterForEnrollmentCode = _.partial(_.filter, _, (course) ->
        course.enrollment_code is enrollmentCode or
          _.find(course.periods, enrollment_code: enrollmentCode)
      )
      operations.push(filterForEnrollmentCode)

    operations.push(sortyByJoinedAt)

    _.last(_.compose(operations...)(@courses))

  registeredCourses: ->
    _.filter @courses, (course) -> course.isRegistered()

  findOrCreateCourse: (collectionUUID, enrollmentCode, options) ->
    @getCourse(collectionUUID, enrollmentCode, options) or (
      courseInfo = _.extend({ecosystem_book_uuid: collectionUUID, enrollment_code: enrollmentCode}, options)
      course = new Course(courseInfo)
      @courses.push(course)
      course
    )

  load: ->
    @isLoading = true
    User.channel.emit('change')
    api.channel.emit('user.status.fetch.send')

  ensureStatusLoaded: (force = false) ->
    @load() if force or not @isLoggedIn()

  isLoggedIn: ->
    !!@profile_url

  onCourseUpdate: (course, changeEvent) ->
    @channel.emit('change', changeEvent)
    @ensureStatusLoaded(true) # re-fetch course list from server

  removeCourse: (course) ->
    index = @courses.indexOf(course)
    @courses.splice(index, 1) unless index is -1
    @channel.emit('change')

  _signalLogoutCompleted: ->
    _.extend(this, BLANK_USER)
    @isLoggingOut = true
    @channel.emit('logout.received')
    @channel.emit('change')

  init: ->
    api.channel.on 'user.status.fetch.receive.*', ({data}) ->
      User.isLoaded = true
      User.isLoading = false
      if data.access_token
        api.channel.emit('set.access_token', data.access_token)
      User.endpoints = data.endpoints
      ExerciseHelpers.setErrataFormURL(data.errata_form_url)

      if data.user
        BootstrapURLs.update(data)
        NotificationActions.startPolling()
        UiSettings.initialize(data.ui_settings)
        User.update(data)
      else
        _.extend(this, BLANK_USER)
        User.channel.emit('change')

  destroy: ->
    User.channel.removeAllListeners()
    _.invoke @courses, 'destroy'
    @courses = []


# start out as a blank user
_.extend(User, BLANK_USER)
User.endpoints = {} # this shoudn't be part of BLANK_USER so it persists between logins

module.exports = User
