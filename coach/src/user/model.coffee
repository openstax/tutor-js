_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'
Course = require '../course/model'
api = require '../api'
{BootstrapURLs, NotificationActions, UiSettings}  = require 'shared'

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

  update: (data, options = {}) ->
    _.extend(this, data.user)
    @_course_data = data.courses
    pending = @validatedPendingCourses()
    @courses = _.compact _.map data.courses, (course) ->
      if course.is_concept_coach and _.detect(course.roles, (role) -> role.type is 'student')
        new Course(course)
    _.each pending, (course) =>
      @courses.push(course)
      course.register(course.enrollment_code, @)

    @channel.emit('change', options)

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

  status: (collectionUUID) ->
    course = @getCourse(collectionUUID)
    isLoggedIn: @isLoggedIn()
    isLoaded:   @isLoaded
    isRegistered: !!course?.isRegistered()
    preValidate: (not @isLoggedIn()) and (not course?.isValidated())

  isEnrolled: (collectionUUID) ->
    Boolean(@isLoggedIn() and @getCourse(collectionUUID))

  getCourse: (collectionUUID) ->
    _.chain(@courses)
      .where( ecosystem_book_uuid: collectionUUID )
      .sortBy( (course) -> course.getRole()?.latest_enrollment_at or '' )
      .last()
      .value()

  registeredCourses: ->
    _.filter @courses, (course) -> course.isRegistered()

  findOrCreateCourse: (collectionUUID) ->
    @getCourse(collectionUUID) or (
      course = new Course(ecosystem_book_uuid: collectionUUID)
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

  onCourseUpdate: (course) ->
    @channel.emit('change')
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
    api.channel.on 'user.status.fetch.receive.*', ({data, desiredView}) ->
      User.isLoaded = true
      User.isLoading = false
      if data.access_token
        api.channel.emit('set.access_token', data.access_token)
      User.endpoints = data.endpoints
      if data.user
        BootstrapURLs.update(data)
        NotificationActions.startPolling()
        UiSettings.initialize(data.ui_settings)
        User.update(data, {desiredView})
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
