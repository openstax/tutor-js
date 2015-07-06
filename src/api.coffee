# This file manages all async state transitions.
#
# These attach to actions to help state changes along.
#
# For example, `TaskActions.load` everntually yields either
# `TaskActions.loaded` or `TaskActions.FAILED`

$ = require 'jquery'
_ = require 'underscore'
{TimeActions} = require './flux/time'
{CurrentUserActions, CurrentUserStore} = require './flux/current-user'
{CourseActions} = require './flux/course'
{LearningGuideActions} = require './flux/learning-guide'
{PerformanceActions} = require './flux/performance'
{RosterActions} = require './flux/roster'
{TaskActions} = require './flux/task'
{TaskStepActions} = require './flux/task-step'
{TaskPlanActions, TaskPlanStore} = require './flux/task-plan'
{TaskTeacherReviewActions, TaskTeacherReviewStore} = require './flux/task-teacher-review'
{TaskPlanStatsActions, TaskPlanStatsStore} = require './flux/task-plan-stats'
{TocActions} = require './flux/toc'
{ExerciseActions} = require './flux/exercise'
{TeacherTaskPlanActions, TeacherTaskPlanStore} = require './flux/teacher-task-plan'
{StudentDashboardActions} = require './flux/student-dashboard'
{CourseListingActions, CourseListingStore} = require './flux/course-listing'
{ReferenceBookActions, ReferenceBookStore} = require './flux/reference-book'
{ReferenceBookPageActions, ReferenceBookPageStore} = require './flux/reference-book-page'

# Do some special things when running without a tutor-server backend.
#
# - suffix calls with `.json` so we can have `/plans` and `/plans/1`
#   - otherwise there would be a file named `plans` and a directory named `plans`
# - do not error when a PUT occurs
IS_LOCAL = window.location.port is '8000' or window.__karma__

# Make sure API calls occur **after** all local Action listeners complete
delay = (ms, fn) -> setTimeout(fn, ms)

setNow = (jqXhr) ->
  date = jqXhr.getResponseHeader('X-App-Date')
  # Fallback to nginx date
  date ?= jqXhr.getResponseHeader('Date')
  TimeActions.setFromString(date)

apiHelper = (Actions, listenAction, successAction, httpMethod, pathMaker) ->
  listenAction.addListener 'trigger', (args...) ->
    # Make sure API calls occur **after** all local Action listeners complete
    delay 20, ->
      {url, payload, httpMethod:httpMethodOverride} = pathMaker(args...)

      opts =
        method: httpMethod or httpMethodOverride
        dataType: 'json'
        headers:
          'X-CSRF-Token': CurrentUserStore.getCSRFToken(),
          token: CurrentUserStore.getToken()
      if payload?
        opts.data = JSON.stringify(payload)
        opts.processData = false
        # For now, the backend is expecting JSON and cannot accept url-encoded forms
        opts.contentType = 'application/json'

      if IS_LOCAL
        [uri, params] = url.split("?")
        if opts.method is 'GET'
          url = "#{uri}.json?#{params}"
        else
          url = "#{uri}/#{opts.method}.json?#{params}"
          opts.method = 'GET'

      resolved = (results, statusStr, jqXhr) ->
        setNow(jqXhr)
        successAction(results, args...) # Include listenAction for faking
      rejected = (jqXhr, statusMessage, err) ->
        setNow(jqXhr)
        statusCode = jqXhr.status
        if statusCode is 200
          # HACK For PUT returning nothing (actually, it returns HTML for some reason)
          successAction('', args...)

        else if statusCode is 400
          CurrentUserActions.logout()
        else if statusMessage is 'parsererror' and statusCode is 200 and IS_LOCAL
          if httpMethod is 'PUT' or httpMethod is 'PATCH'
            # HACK for PUT
            successAction(null, args...)
          else
            # Hack for local testing. Webserver returns 200 + HTML for 404's
            Actions.FAILED(404, 'Error Parsing the JSON or a 404', args...)
        else if statusCode is 404
          Actions.FAILED(statusCode, 'ERROR_NOTFOUND', args...)
        else
          # Parse the error message and fail
          try
            msg = JSON.parse(jqXhr.responseText)
          catch e
            msg = jqXhr.responseText
          Actions.FAILED(statusCode, msg, args...)

      $.ajax(url, opts)
      .then(resolved, rejected)


start = ->
  apiHelper TaskActions, TaskActions.load, TaskActions.loaded, 'GET', (id) ->
    url: "/api/tasks/#{id}"

  # apiHelper TaskActions, TaskActions.save, TaskActions.saved, 'PATCH', (id, obj) ->
  #   url: "/api/tasks/#{id}"
  #   payload: obj

  saveHelper = (id) ->
    obj = TaskPlanStore.getChanged(id)
    if TaskPlanStore.isNew(id)
      # HACK: to make the JSON valid
      obj.type ?= 'reading'
      courseId = obj._HACK_courseId
      delete obj._HACK_courseId

      url: "/api/courses/#{courseId}/plans"
      httpMethod: 'POST'
      payload: obj
    else
      url: "/api/plans/#{id}"
      httpMethod: 'PATCH'
      payload: obj

  apiHelper TaskPlanActions, TaskPlanActions.save, TaskPlanActions.saved, null, saveHelper

  apiHelper TaskPlanActions, TaskPlanActions.delete, TaskPlanActions.deleted, 'DELETE', saveHelper

  apiHelper TaskPlanActions, TaskPlanActions.load , TaskPlanActions.loaded, 'GET', (id) ->
    url: "/api/plans/#{id}"

  apiHelper TaskPlanStatsActions, TaskPlanStatsActions.load , TaskPlanStatsActions.loaded, 'GET', (id) ->
    url: "/api/plans/#{id}/stats"

  apiHelper ExerciseActions, ExerciseActions.load, ExerciseActions.loaded, 'GET', (courseId, pageIds) ->
    page_id_str = pageIds.join('&page_ids[]=')
    url: "/api/courses/#{courseId}/exercises?page_ids[]=#{page_id_str}"

  apiHelper TocActions, TocActions.load, TocActions.loaded, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/readings"

  apiHelper CourseActions, CourseActions.loadPractice, CourseActions.loadedPractice, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/practice"

  apiHelper CourseActions, CourseActions.loadGuide, CourseActions.loadedGuide, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/guide"

  createMethod = if IS_LOCAL then 'GET' else 'POST' # Hack to get back a full practice on create when on local
  apiHelper CourseActions, CourseActions.createPractice, CourseActions.createdPractice, createMethod, (courseId, params) ->
    url: "/api/courses/#{courseId}/practice"
    payload: params

  apiHelper CourseActions, CourseActions.load, CourseActions.loaded, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}"

  apiHelper LearningGuideActions, LearningGuideActions.load, LearningGuideActions.loaded, 'GET', (id) ->
    url: "/api/courses/#{id}/guide"

  apiHelper PerformanceActions, PerformanceActions.load, PerformanceActions.loaded, 'GET', (id) ->
    url: "/api/courses/#{id}/performance"

  apiHelper RosterActions, RosterActions.delete, RosterActions.deleted, 'DELETE', (id) ->
    url: "/api/students/#{id}"
  apiHelper RosterActions, RosterActions.save, RosterActions.saved, 'PATCH', (courseId, id, params) ->
    url: "/api/courses/#{courseId}/students/#{id}", payload: params
  apiHelper RosterActions, RosterActions.create, RosterActions.created, createMethod, (courseId, params) ->
    url: "/api/courses/#{courseId}/students", payload: params
  apiHelper RosterActions, RosterActions.load, RosterActions.loaded, 'GET', (id) ->
    url: "/api/courses/#{id}/students"

  apiHelper TaskStepActions, TaskStepActions.load, TaskStepActions.loaded, 'GET', (id) ->
    throw new Error('BUG: Wrong type') unless typeof id is 'string' or typeof id is 'number'
    url: "/api/steps/#{id}"

  # # Go from complete to load so we fetch the new JSON
  # apiHelper TaskStepActions, TaskStepActions.complete, TaskStepActions.loaded, 'PUT', (id) ->
  #   url: "/api/steps/#{id}/completed"

  # Go from complete to load so we fetch the new JSON
  apiHelper TaskStepActions, TaskStepActions.complete, TaskStepActions.completed, 'PUT', (id) ->
    url: "/api/steps/#{id}/completed"

  apiHelper TaskStepActions, TaskStepActions.loadRecovery, TaskStepActions.loadedRecovery, 'PUT', (id) ->
    url: "/api/steps/#{id}/recovery"

  apiHelper TaskStepActions, TaskStepActions.setFreeResponseAnswer, TaskStepActions.saved, 'PATCH', (id, free_response) ->
    url: "/api/steps/#{id}"
    payload: {free_response}

  apiHelper TaskStepActions, TaskStepActions.setAnswerId, TaskStepActions.saved, 'PATCH', (id, answer_id) ->
    url: "/api/steps/#{id}"
    payload: {answer_id}

  apiHelper TaskActions, TaskActions.loadUserTasks, TaskActions.loadedUserTasks, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/tasks"

  apiHelper TaskTeacherReviewActions, TaskTeacherReviewActions.load, TaskTeacherReviewActions.loaded, 'GET', (id) ->
    url: "/api/plans/#{id}/review"

  apiHelper TeacherTaskPlanActions, TeacherTaskPlanActions.load, TeacherTaskPlanActions.loaded, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/dashboard"

  apiHelper CurrentUserActions, CurrentUserActions.loadName, CurrentUserActions.loadedName, 'GET', ->
    url: '/api/user'

  apiHelper CourseListingActions, CourseListingActions.load, CourseListingActions.loaded, 'GET', ->
    url: '/api/user/courses'

  apiHelper ReferenceBookActions, ReferenceBookActions.load, ReferenceBookActions.loaded, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/readings"


  apiHelper ReferenceBookPageActions, ReferenceBookPageActions.load, ReferenceBookPageActions.loaded, 'GET', (cnxId) ->
    url: "/api/pages/#{cnxId}"

  apiHelper StudentDashboardActions, StudentDashboardActions.load, StudentDashboardActions.loaded, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/dashboard"

  CurrentUserActions.logout.addListener 'trigger', ->
    # Logging out programatically needs to be done via a form submission or follow redirects
    # $.ajax('/accounts/logout', {method: 'DELETE'})
    # .always ->
    console.warn('Logging out programatically needs to be done via a form submission or follow redirects')
    window.location.href = '/'


module.exports = {start}
