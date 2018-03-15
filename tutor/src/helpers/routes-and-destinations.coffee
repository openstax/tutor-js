_ = require 'underscore'
Router = require '../helpers/router'
isNil = require 'lodash/isNil'

COURSE_SETTINGS = 'Course Settings'
COURSE_ROSTER = 'Course Roster'
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
  dashboard:
    label: DASHBOARD
  viewStudentDashboard:
    label: DASHBOARD
  viewPerformanceGuide:
    label: PERFORMANCE_FORECAST
    condition: (match) ->
      isNil(match.params.roleId)
  viewTeacherDashboard:
    label: DASHBOARD
  viewScores:
    label: SCORES
  viewQuestionsLibrary:
    label: QUESTION_LIBRARY
  taskplans:
    label: DASHBOARD
  calendarByDate:
    label: DASHBOARD
  calendarViewPlanStats:
    label: DASHBOARD
  courseRoster:
    label: COURSE_ROSTER
  courseSettings:
    label: COURSE_SETTINGS
  viewStats:
    label: PLAN_STATS
  reviewTask:
    label: PLAN_REVIEW
  reviewTaskPeriod:
    label: PLAN_REVIEW
  reviewTaskStep:
    label: PLAN_REVIEW

destinationHelpers =
  getDestinationName: (routeName) ->
    REMEMBERED_ROUTES[routeName].label

  routeFromPath: (path) ->
    match = Router.currentMatch(path)
    _.find(match?.entry.paths, (pathName) ->
      REMEMBERED_ROUTES[pathName].label
    )

  destinationFromPath: (path) ->
    route = Router.currentMatch(path)
    @getDestinationName(route.entry.name)

  shouldRememberRoute: (path) ->
    match = Router.currentMatch(path)

    (
      !! REMEMBERED_ROUTES[match?.entry.name]
    ) && (
      (
        REMEMBERED_ROUTES[match?.entry.name].condition? &&
        REMEMBERED_ROUTES[match?.entry.name].condition(match)
      ) ||
        ! REMEMBERED_ROUTES[match?.entry.name].condition?
    )


module.exports = destinationHelpers
