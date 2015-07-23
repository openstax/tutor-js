# coffeelint: disable=no_empty_functions
_ = require 'underscore'
flux = require 'flux-react'

{CourseActions, CourseStore} = require './course'

# Read the CSRF token from document's meta tag.  If not found, log a warning but proceed
# on the assumption that the server knows what it's doing.
CSRF_Token = document.head.querySelector('meta[name=csrf-token]')?.getAttribute("content")
console?.warn?("CSRF token was not found, proceeding without CSRF protection") unless CSRF_Token


# TODO consider putting this with policies?  especially when this same data could be used for other
# roles based stuffs?
# Roles listed in ascending order of rank, where admin will have most permissions
RANKS = [
  'guest'
  'student'
  'teacher'
  'admin'
]

getRankByRole = (roleType) ->
  rank = RANKS.indexOf(roleType)
  console.warn("Warning: #{roleType} does not exist.  Rank of -1 assigned.  Check session status.") if rank < 0

  rank

ROUTES =
  dashboard:
    label: 'Dashboard'
    roles:
      teacher: 'taskplans'
      student: 'viewStudentDashboard'
      default: 'root'
  guide:
    label: 'Learning Guide'
    roles:
      student: 'viewGuide'
  performance:
    label: 'Performance Report'
    roles:
      teacher: 'viewPerformance'
  course:
    label: 'Course Settings'
    roles:
      teacher: 'courseSettings'


CurrentUserActions = flux.createActions [
  'setToken'  # (token) ->
  'loadName'
  'loadedName'
  'logout'    # () ->    # API Hooks onto this action and transitions
  'reset'
]

CurrentUserStore = flux.createStore
  actions: [
    CurrentUserActions.setToken
    CurrentUserActions.loadName
    CurrentUserActions.loadedName
    CurrentUserActions.reset
  ]

  _token: null
  _viewingCourseId: null

  _getRouteByRole: (routeType, menuRole) ->
    ROUTES[routeType].roles[menuRole] or ROUTES[routeType].roles.default

  _getCourseRole: (courseId, silent = true) ->
    course = CourseStore.get(courseId)
    courseRoles = course?.roles or [{type: 'guest'}]

    role = _.chain(courseRoles)
      .pluck('type')
      .sortBy((roleType) ->
        # sort by rank -- Teacher role will take precedence over student role for example
        -1 * getRankByRole(roleType)
      )
      .first()
      .value()

    @_setViewingCourse(courseId) unless silent

    role

  _setViewingCourse: (courseId) ->
    @_viewingCourseId = courseId

  _unsetViewingCourse: ->
    @_viewingCourseId = null

  setToken: (@_token) -> # Save the token

  loadName: -> # Used by API
  loadedName: (results) ->
    @_name = results.name
    @_isAdmin = results.is_admin
    @emitChange()

  reset: ->
    @_token = null
    @_name = 'Guest'
    @_viewingCourseId = null

  exports:
    getToken: -> @_token
    getCSRFToken: -> CSRF_Token
    getName: -> @_name
    isAdmin: -> @_isAdmin

    getCourseRole: (courseId, silent = true) ->
      @_getCourseRole(courseId, silent)

    getViewingCourseRole: ->
      @_getCourseRole(@_viewingCourseId) if @_viewingCourseId?

    getDashboardRoute: (courseId, silent = true) ->
      menuRole = @_getCourseRole(courseId, silent)
      @_getRouteByRole('dashboard', menuRole)

    getHelpLink: (courseId) ->
      'https://openstaxtutor.zendesk.com/agent/dashboard'

    # if menu routes are being retrieved, then getCourseRole should store
    # what courseId is being viewed.
    getMenuRoutes: (courseId, silent = false) ->
      menuRole = @_getCourseRole(courseId, silent)
      routes = _.keys(ROUTES)

      _.chain(routes)
        .map((routeType) =>
          routeName = @_getRouteByRole(routeType, menuRole)

          if routeName?
            name: routeName
            label: ROUTES[routeType].label
        )
        .compact()
        .value()


module.exports = {CurrentUserActions, CurrentUserStore}
