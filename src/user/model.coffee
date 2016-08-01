_ = require 'underscore'
React = require 'react'
EventEmitter2 = require 'eventemitter2'
Course = require '../course/model'
api = require '../api'
{BootrapURLs, NotificationActions}  = require 'openstax-react-components'

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

  getCourse: (collectionUUID) ->
    _.findWhere( @courses, ecosystem_book_uuid: collectionUUID )

  registeredCourses: ->
    _.filter @courses, (course) -> course.isRegistered()

  findOrCreateCourse: (collectionUUID) ->
    @getCourse(collectionUUID) or (
      course = new Course(ecosystem_book_uuid: collectionUUID)
      @courses.push(course)
      course
    )

  ensureStatusLoaded: (force = false) ->
    api.channel.emit('user.status.send.fetch') if force or not @isLoggedIn()

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

  init: ->
    api.channel.on 'user.status.receive.*', ({data}) ->
      User.isLoaded = true

      if data.access_token
        api.channel.emit('set.access_token', data.access_token)
      User.endpoints = data.endpoints
      if data.user
        BootrapURLs.update(data)
        NotificationActions.startPolling()
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
