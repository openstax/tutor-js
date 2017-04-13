# coffeelint: disable=no_empty_functions
_ = require 'lodash'
flux = require 'flux-react'
{CourseListingStore} = require './course-listing'
{CourseActions, CourseStore} = require './course'

# Read the CSRF token from document's meta tag.  If not found, log a warning but proceed
# on the assumption that the server knows what it's doing.
CSRF_Token = document.head.querySelector('meta[name=csrf-token]')?.getAttribute("content")


# TODO consider putting this with policies?  especially when this same data could be used for other
# roles based stuffs?
# Roles listed in ascending order of rank, where admin will have most permissions
RANKS = [
  'guest'
  'student'
  'teacher'
  'admin'
]

TEACHER_FACULTY_STATUS = 'confirmed_faculty'

getRankByRole = (roleType) ->
  rank = RANKS.indexOf(roleType)
  console.warn("Warning: #{roleType} does not exist.  Rank of -1 assigned.  Check session status.") if rank < 0

  rank

ROUTES =
  dashboard:
    label: 'Dashboard'
    allowedForCourse: (course) -> !!course
    roles:
      default: 'dashboard'
  guide:
    label: 'Performance Forecast' # a bit hard to read, but we only want to reject the === true case
    allowedForCourse: (course) -> not course?.is_concept_coach is true
    roles:
      student: 'viewPerformanceGuide'
      teacher: 'viewPerformanceGuide'
  questions:
    label: 'Question Library'
    roles:
      teacher: 'viewQuestionsLibrary'
  scores:
    label: 'Student Scores'
    roles:
      teacher: 'viewScores'
  course:
    label: 'Course Settings and Roster'
    roles:
      teacher: 'courseSettings'
  get_started:
    label: 'Getting Started'
    allowedForCourse: (course) -> course?.is_concept_coach is true
    roles:
      teacher: 'ccDashboardHelp'
  changeId:
    label: 'Change Student ID'
    roles:
      student: 'changeStudentId'
  createCourse:
    label: 'Teach Another Course'
    roles:
      teacher: 'createNewCourse'
    allowedForCourse: (course) ->
      if course
        CourseStore.isTeacher(course.id)
      else
        CurrentUserStore.isTeacher()
    isTeacherOnly: true
  cloneCourse:
    label: 'Teach This Course Again'
    params: (courseId) -> {sourceId: courseId}
    roles:
      teacher: 'createNewCourse'
    isTeacherOnly: true
  addOrCopyCourse:
    label: 'Add or Copy a Course'
    allowedForCourse: (course) -> (not course) and CurrentUserStore.isTeacher() and CourseListingStore.hasCourses()
    roles:
      default: 'createNewCourse'

CurrentUserActions = flux.createActions [
  'setToken'  # (token) ->
  'load'
  'loaded'
  'logout'    # () ->    # API Hooks onto this action and transitions
  'reset'
]

TUTOR_HELP = 'http://openstax.force.com/support?l=en_US&c=Products%3ATutor'
TUTOR_CONTACT = 'http://openstax.force.com/support/?cu=1&fs=ContactUs&l=en_US&c=Products%3ATutor'
CONCEPT_COACH_HELP = 'http://openstax.force.com/support?l=en_US&c=Products%3AConcept_Coach'
CONCEPT_COACH_CONTACT = 'http://openstax.force.com/support/?cu=1&fs=ContactUs&l=en_US&c=Products%3AConcept_Coach'

isDefined = _.negate(_.isUndefined)

CurrentUserStore = flux.createStore
  actions: [
    CurrentUserActions.setToken
    CurrentUserActions.load
    CurrentUserActions.loaded
    CurrentUserActions.reset
  ]

  _user: {}

  _token: null
  _viewingCourseId: null

  _getRouteByRole: (routeType, menuRole) ->
    ROUTES[routeType].roles[menuRole] or ROUTES[routeType].roles.default

  _getParamsForRoute: (courseId, routeType, menuRole) ->
    if _.isFunction(ROUTES[routeType].params)
      ROUTES[routeType].params(courseId, menuRole)
    else if isDefined(ROUTES[routeType].params)
      ROUTES[routeType].params
    else
      {courseId}

  _getOptionsForRoute: (courseId, routeType, menuRole) ->
    if _.isFunction(ROUTES[routeType].options)
      ROUTES[routeType].options(courseId, menuRole)
    else
      ROUTES[routeType].options

  _getCourseRole: (courseId, silent = true) ->
    course = CourseStore.get(courseId)
    courseRoles = course?.roles or [{type: 'guest'}]

    role = _.chain(courseRoles)
      .sortBy((role) ->
        # sort by rank -- Teacher role will take precedence over student role for example
        -1 * getRankByRole(role.type)
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

  load: -> @_loading = true

  loaded: (results) ->
    @_user = results
    @_loaded = true
    @_loading = false
    @emitChange()

  reset: ->
    @_token = null
    @_user.name = 'Guest'
    @_user.profile_url = null
    @_user.faculty_status = undefined
    @_viewingCourseId = null
    @emitChange()

  exports:
    getToken: -> @_token
    getCSRFToken: -> CSRF_Token
    getName: -> @_user.name
    isAdmin: -> @_user.is_admin
    isTeacher: -> @_user.faculty_status is TEACHER_FACULTY_STATUS
    get: -> @_user
    isContentAnalyst: -> @_user.is_content_analyst
    isCustomerService: -> @_user.is_customer_service
    getProfileUrl: -> @_user.profile_url

    # Loads the store if it's not already loaded or loading
    # Returns false if the store is already loaded, true otherwise
    ensureLoaded: ->
      CurrentUserActions.load() unless @_loaded or @_loading

    getCourseRole: (courseId, silent = true) ->
      @_getCourseRole(courseId, silent)

    getCourseVerifiedRole: (courseId) ->
      if @exports.isTeacher.call(@)
        @_getCourseRole(courseId).type
      else
        'student'

    getViewingCourseRole: ->
      @_getCourseRole(@_viewingCourseId).type if @_viewingCourseId?

    getDashboardRoute: (courseId, silent = true) ->
      menuRole = @_getCourseRole(courseId, silent).type
      course = CourseStore.get(courseId)
      if course?.is_concept_coach
        @_getRouteByRole('cc_dashboard', menuRole)
      else
        @_getRouteByRole('dashboard', menuRole)

    getContactLink: (courseId) ->
      course = CourseStore.get(courseId)
      if course.is_concept_coach then CONCEPT_COACH_CONTACT else TUTOR_CONTACT

    getHelpLink: (courseId) ->
      course = CourseStore.get(courseId)
      if course
        if course.is_concept_coach then CONCEPT_COACH_HELP else TUTOR_HELP
      else
        courses = CourseListingStore.allCourses()
        # link to TUTOR_HELP if they do not have any CC courses
        if _.every(courses, (course) -> not course.is_concept_coach)
          TUTOR_HELP
        else
          CONCEPT_COACH_HELP

    # if menu routes are being retrieved, then getCourseRole should store
    # what courseId is being viewed.
    getCourseMenuRoutes: (courseId, silent = false, isTeacherOnly) ->
      course = CourseStore.get(courseId)
      menuRole = @_getCourseRole(courseId, silent).type
      validRoutes = _.pickBy ROUTES, (route) ->
        route.allowedForCourse?(course) isnt false and
          route.isTeacherOnly is isTeacherOnly
      routes = _.keys(validRoutes)

      _.chain(routes)
        .map((routeType) =>
          name = @_getRouteByRole(routeType, menuRole)

          if name?
            options = @_getOptionsForRoute(courseId, routeType, menuRole)
            params  = @_getParamsForRoute(courseId, routeType, menuRole)
            label = ROUTES[routeType].label
            label = label(courseId) if _.isFunction(label)

            route = {name, label}
            route.options = options if options
            route.params = params if params
            route

        )
        .compact()
        .value()


module.exports = {CurrentUserActions, CurrentUserStore}
