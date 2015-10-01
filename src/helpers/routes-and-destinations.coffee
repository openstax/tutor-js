_ = require 'underscore'
COURSE_SETTINGS = 'Course Settings'
COURSES = 'Courses'
DASHBOARD = 'Dashboard'
EXTERNAL_BUILDER = 'External Assignment'
HOMEWORK_BUILDER = 'Homework Builder'
LEARNING_GUIDE = 'Performance Forecast'
SCORES = 'Scores'
PLAN_REVIEW = 'Plan Review'
PLAN_STATS = 'Plan Stats'
PRACTICE = 'Practice'
READING_BUILDER = 'Reading Builder'
STEP = 'Step'
TASK = 'Task'

REMEMBERED_ROUTES =
  dashboard: COURSES
  viewStudentDashboard: DASHBOARD
  viewGuide: LEARNING_GUIDE
  viewTeacherDashboard: DASHBOARD
  viewScores: SCORES
  viewTeacherGuide: LEARNING_GUIDE
  viewStudentTeacherGuide: LEARNING_GUIDE
  taskplans: DASHBOARD
  calendarByDate: DASHBOARD
  courseSettings: COURSE_SETTINGS
  viewStats: PLAN_STATS
  reviewTask: PLAN_REVIEW
  reviewTaskPeriod: PLAN_REVIEW
  reviewTaskStep: PLAN_REVIEW

destinationHelpers =
  getDestinationName: (routeName) ->
    REMEMBERED_ROUTES[routeName]

  routeFromPath: (path, matchRoutes) ->
    matchedRoute = matchRoutes(path)
    _.last(matchedRoute.routes) if matchedRoute?.routes?.length

  destinationFromPath: (path, matchRoutes) ->
    @getDestinationName( @routeFromPath(arguments...)?.name )

  shouldRememberRoute: (routeName, router) ->
    !!@destinationFromPath(routeName.path, router.match)

module.exports = destinationHelpers
