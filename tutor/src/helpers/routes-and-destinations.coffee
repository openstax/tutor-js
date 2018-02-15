_ = require 'underscore'
Router = require '../helpers/router'

COURSE_SETTINGS = 'Course Settings'
COURSES = 'Courses'
DASHBOARD = 'Dashboard'
QUESTION_LIBRARY = 'Question Library'
EXTERNAL_BUILDER = 'External Assignment'
HOMEWORK_BUILDER = 'Homework Builder'
PERFORMANCE_FORECAST = 'Performance Forecast'
SCORES = 'Scores'
PLAN_REVIEW = 'Plan Review'
PLAN_STATS = 'Plan Stats'
PRACTICE = 'Practice'
READING_BUILDER = 'Reading Builder'
STEP = 'Step'
TASK = 'Task'

REMEMBERED_ROUTES =
  dashboard: DASHBOARD
  viewStudentDashboard: DASHBOARD
  viewPerformanceForecast: PERFORMANCE_FORECAST
  viewTeacherDashboard: DASHBOARD
  viewScores: SCORES
  viewQuestionsLibrary: QUESTION_LIBRARY
  viewTeacherPerformanceForecast: PERFORMANCE_FORECAST
  viewStudentTeacherPerformanceForecast: PERFORMANCE_FORECAST
  taskplans: DASHBOARD
  calendarByDate: DASHBOARD
  calendarViewPlanStats: DASHBOARD
  courseSettings: COURSE_SETTINGS
  viewStats: PLAN_STATS
  reviewTask: PLAN_REVIEW
  reviewTaskPeriod: PLAN_REVIEW
  reviewTaskStep: PLAN_REVIEW

destinationHelpers =
  getDestinationName: (routeName) ->
    REMEMBERED_ROUTES[routeName]

  routeFromPath: (path) ->
    match = Router.currentMatch(path)
    _.find(match?.entry.paths, (pathName) ->
      REMEMBERED_ROUTES[pathName]
    )

  destinationFromPath: (path) ->
    route = Router.currentMatch(path)
    @getDestinationName(route.entry.name)

  shouldRememberRoute: (path) ->
    match = Router.currentMatch(path)
    !! REMEMBERED_ROUTES[match?.entry.name]


module.exports = destinationHelpers
