_ = require 'underscore'
Router = require 'react-router'
{HistoryLocation} = require 'react-router'
DestinationHelper = require '../helpers/routes-and-destinations'

# generate custom event data for routes
Events =
  viewTaskStep: ({courseId}) ->
    # track all work done on a course
    Analytics.sendEvent 'Course', 'Work', label: courseId

  viewStudentDashboard: ({courseId}) ->
    # compare activity between courses
    Analytics.sendEvent 'Student', 'Dashboard', label: courseId


# Translators convert a url like '/foo/bar/123/baz/1' into a simplified one like just '/foo/bar'
Translators =

  dashboard:            ({courseId}) -> "/student/choose-course/#{courseId}"
  viewTaskStep:         ({courseId}) -> "/student/task-step/#{courseId}"
  viewGuide:            ({courseId}) -> "/student/performance-forecast/#{courseId}"
  viewStudentDashboard: ({courseId}) -> "/student/dashboard/#{courseId}"
  viewPractice:         ({courseId}) -> "/student/practice/#{courseId}"

  calendarByDate:        ({courseId}) -> "/teacher/calendar/#{courseId}"
  viewTeacherGuide:      ({courseId}) -> "/teacher/performance-forecast/#{courseId}"
  viewScores:            ({courseId}) -> "/teacher/student-scores/#{courseId}"
  courseSettings:        ({courseId}) -> "/teacher/roster/#{courseId}"
  editReading:           ({courseId}) -> "/teacher/assignment/edit/#{courseId}"
  editHomework:          ({courseId}) -> "/teacher/assignment/edit/#{courseId}"
  editExternal:          ({courseId}) -> "/teacher/assignment/edit/#{courseId}"
  createReading:         ({courseId}) -> "/teacher/assignment/create/#{courseId}"
  createHomework:        ({courseId}) -> "/teacher/assignment/create/#{courseId}"
  createExternal:        ({courseId}) -> "/teacher/assignment/create/#{courseId}"
  calendarViewPlanStats: ({courseId}) -> "/teacher/metrics/quick/#{courseId}"
  reviewTask:            ({courseId}) -> "/teacher/metrics/review/#{courseId}"

GA = undefined

Analytics =

  setTracker: (tracker) -> GA = tracker

  sendPageView: (url) ->
    GA?('set', 'page', url)

  onNavigation: (change, router) ->
    return unless GA
    route  = DestinationHelper.routeFromPath(change.path, router.match)
    return @sendPageView("/not-found/#{change.path}") unless route

    params = router.getCurrentParams()
    path   = Translators[route.name]?( params ) or change.path

    # if we're also going to send custom events then we set the page
    if Events[route.name]
      Events[route.name]( params )
      @sendPageView() # url's not needed since it was set before events
    else
      @sendPageView(path)

  sendEvent: (category, action, attrs) ->
    return unless GA
    GA('send', 'event', category, action, attrs.label, attrs.value)

module.exports = Analytics
