_ = require 'underscore'

Router = require '../helpers/router'

Courses = require('../models/courses-map').default

# generate custom event data for routes
Events =
  viewTaskStep: ({courseId}) ->
    # track all work done on a course
    Analytics.sendEvent 'Course', 'Work', label: courseId

  viewStudentDashboard: ({courseId}) ->
    # compare activity between courses
    Analytics.sendEvent 'Student', 'Dashboard', label: courseId

# a bit shorter helper methods
isTeacher = (courseId) -> Courses.get(courseId).is_teacher
getRole = (courseId) ->
  if Courses.get(courseId).is_teacher then 'teacher' else 'student'

assignmentTypeTranslator = (assignmentType, {courseId, id}) ->
  type = if id is 'new' then 'create' else 'edit'
  "/teacher/assignment/#{type}/#{assignmentType}/#{courseId}"

# Translators convert a url like '/foo/bar/123/baz/1' into a simplified one like just '/foo/bar'
Translators =
  dashboard:            ({courseId}) ->
    if isTeacher(courseId) then "/teacher/calendar/#{courseId}" else "/student/dashboard/#{courseId}"
  practiceTopics:       ({courseId}) -> "/student/practice/#{courseId}"
  viewPerformanceGuide:  ({courseId}) ->
    "/#{getRole(courseId)}/performance-forecast/#{courseId}"
  calendarByDate:        ({courseId}) -> "/teacher/calendar/#{courseId}"
  viewScores:            ({courseId}) -> "/teacher/student-scores/#{courseId}"
  courseSettings:        ({courseId}) -> "/teacher/roster/#{courseId}"
  editReading:    _.partial(assignmentTypeTranslator, 'reading')
  editHomework:   _.partial(assignmentTypeTranslator, 'homework')
  editExternal:   _.partial(assignmentTypeTranslator, 'external')
  editEvent:      _.partial(assignmentTypeTranslator, 'event')
  createReading:  _.partial(assignmentTypeTranslator, 'reading')
  createHomework: _.partial(assignmentTypeTranslator, 'homework')
  createExternal: _.partial(assignmentTypeTranslator, 'external')
  createEvent:    _.partial(assignmentTypeTranslator, 'event')
  calendarViewPlanStats: ({courseId}) -> "/teacher/metrics/quick/#{courseId}"
  reviewTask:            ({courseId}) -> "/teacher/metrics/review/#{courseId}"
  viewReferenceBook:        ({courseId}) -> "/reference-view/#{courseId}"
  viewReferenceBookSection: ({courseId, section}) -> "/reference-view/#{courseId}/section/#{section}"
  viewReferenceBookPage:    ({courseId, cnxId}) -> "/reference-view/#{courseId}/page/#{cnxId}"

  # Task steps are viewed by both teacher and student with no difference in params
  viewTaskStep:         ({courseId}) ->
    role = Courses.get(courseId).primaryRole.type
    "/#{role}/task-step/#{courseId}"


GA = undefined

Analytics =

  setTracker: (tracker) -> GA = tracker

  sendPageView: (url) ->

    GA?('send', 'pageview', url)

  onNavigation: (path) ->
    return unless GA
    route = Router.currentMatch(path)

    return @sendPageView("/not-found#{path}") unless route

    translatedPath = Translators[route.entry.name]?( route.params ) or route.pathname

    # if we're also going to send custom events then we set the page
    if Events[route.entry.name]
      GA('set', 'page', translatedPath)
      Events[route.entry.name]( route.params )
      @sendPageView() # url's not needed since it was set before events
    else
      @sendPageView(translatedPath)

  sendEvent: (category, action, attrs) ->
    return unless GA
    GA('send', 'event', category, action, attrs.label, attrs.value)

module.exports = Analytics
