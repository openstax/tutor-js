# coffeelint: disable=no_empty_functions
_ = require 'underscore'
flux = require 'flux-react'

{CourseActions, CourseStore} = require './course'

CurrentUserActions = flux.createActions [
  'setToken'  # (token) ->
  'loadAllCourses'
  'loadedAllCourses'
  'loadName'
  'loadedName'
  'logout'    # () ->    # API Hooks onto this action and transitions
]

CurrentUserStore = flux.createStore
  actions: [
    CurrentUserActions.setToken
    CurrentUserActions.loadAllCourses
    CurrentUserActions.loadedAllCourses
    CurrentUserActions.loadName
    CurrentUserActions.loadedName
  ]

  _token: null
  _courseIds: null # Just store the id's. They will be looked up in the course store

  setToken: (@_token) -> # Save the token

  loadName: -> # Used by API
  loadedName: (results) ->
    @_name = results.name
    @emitChange()

  loadAllCourses: -> # Used by API
  loadedAllCourses: (results) ->
    # {items} = results # TODO: This JSON format is inconsistent with the paged results
    items = results
    @_courses = _.map items, (course) ->
      {id} = course
      CourseActions.loaded(course, id)
      id # Just store the ids in @_courses

    @emitChange()

  exports:
    getToken: -> @_token
    isCoursesLoaded: -> !!@_courses
    getName: -> @_name
    getCourseRole: (courseId) ->
      course = CourseStore.get(courseId)
      courseRoles = course?.roles or []
      role = 'guest'

      if _.findWhere(courseRoles, type: 'teacher')?
        role = 'teacher'
      else if _.findWhere(courseRoles, type: 'student')?
        role = 'student'

      role

    getCourses: ->
      _.map @_courses, (id) ->
        CourseStore.get(id)

module.exports = {CurrentUserActions, CurrentUserStore}
