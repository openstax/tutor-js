# This file manages all async state transitions.
#
# These attach to actions to help state changes along.
#
# For example, `TaskActions.load` everntually yields either
# `TaskActions.loaded` or `TaskActions.FAILED`

$ = require 'jquery'
_ = require 'underscore'
{CurrentUserActions, CurrentUserStore} = require './flux/current-user'
{CourseActions} = require './flux/course'
{TaskActions} = require './flux/task'
{TaskStepActions} = require './flux/task-step'
{TaskPlanActions, TaskPlanStore} = require './flux/task-plan'
{TocActions} = require './flux/toc'
{ExerciseActions} = require './flux/exercise'
{TeacherTaskPlanActions, TeacherTaskPlanStore} = require './flux/teacher-task-plan'

# Do some special things when running without a tutor-server backend.
#
# - suffix calls with `.json` so we can have `/plans` and `/plans/1`
#   - otherwise there would be a file named `plans` and a directory named `plans`
# - do not error when a PUT occurs
IS_LOCAL = window.location.port is '8000' or window.__karma__

# Make sure API calls occur **after** all local Action listeners complete
delay = (ms, fn) -> setTimeout(fn, ms)

apiHelper = (Actions, listenAction, successAction, httpMethod, pathMaker) ->
  listenAction.addListener 'trigger', (args...) ->
    # Make sure API calls occur **after** all local Action listeners complete
    delay 20, ->
      {url, payload, httpMethod:httpMethodOverride} = pathMaker(args...)

      opts =
        method: httpMethod or httpMethodOverride
        dataType: 'json'
        headers:
          token: CurrentUserStore.getToken()
      if payload?
        opts.data = JSON.stringify(payload)
        opts.processData = false
        # For now, the backend is expecting JSON and cannot accept url-encoded forms
        opts.contentType = 'application/json'

      url = "#{url}.json" if IS_LOCAL

      resolved = (results) -> successAction(results, args...) # Include listenAction for faking
      rejected = (jqXhr, statusMessage, err) ->
        statusCode = jqXhr.status
        if statusCode is 200
          # HACK For PUT returning nothing (actually, it returns HTML for some reason)
          successAction(args...)

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

  apiHelper TaskPlanActions, TaskPlanActions.publish, TaskPlanActions.saved, 'POST', (id) ->
    url: "/api/plans/#{id}/publish"

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

  apiHelper ExerciseActions, ExerciseActions.load, ExerciseActions.loaded, 'GET', (courseId, pageIds) ->
    page_id_str = pageIds.join('&page_ids[]=')
    url: "/api/courses/#{courseId}/exercises?page_ids[]=#{page_id_str}"

  apiHelper TocActions, TocActions.load, TocActions.loaded, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/readings"

  apiHelper CourseActions, CourseActions.load, CourseActions.loaded, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/practice"

  createMethod = if IS_LOCAL then 'GET' else 'POST' # Hack to get back a full practice on create when on local
  apiHelper CourseActions, CourseActions.createPractice, CourseActions.createdPractice, createMethod, (courseId) ->
    url: "/api/courses/#{courseId}/practice"


  apiHelper TaskStepActions, TaskStepActions.load, TaskStepActions.loaded, 'GET', (id) ->
    throw new Error('BUG: Wrong type') unless typeof id is 'string'
    url: "/api/steps/#{id}"

  # Go from complete to load so we fetch the new JSON
  apiHelper TaskStepActions, TaskStepActions.complete, TaskStepActions.loaded, 'PUT', (id) ->
    url: "/api/steps/#{id}/completed"

  apiHelper TaskStepActions, TaskStepActions.loadRecovery, TaskStepActions.loadedRecovery, 'PUT', (id) ->
    url: "/api/steps/#{id}/recovery"

  apiHelper TaskStepActions, TaskStepActions.setFreeResponseAnswer, TaskStepActions.saved, 'PATCH', (id, free_response) ->
    url: "/api/steps/#{id}"
    payload: {free_response}

  apiHelper TaskStepActions, TaskStepActions.setAnswerId, TaskActions.saved, 'PATCH', (id, answer_id) ->
    url: "/api/steps/#{id}"
    payload: {answer_id}


  TaskActions.loadUserTasks.addListener 'trigger', (courseId) ->
    url = "/api/courses/#{courseId}/tasks"
    url = "#{url}.json" if IS_LOCAL
    opts =
      dataType: 'json'
      headers:
        token: CurrentUserStore.getToken()

    $.ajax(url, opts)
    .then (results) ->
      TaskActions.loadedUserTasks(results.items)

  apiHelper TeacherTaskPlanActions, TeacherTaskPlanActions.load, TeacherTaskPlanActions.loaded, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/plans"


  apiHelper CurrentUserActions, CurrentUserActions.loadAllCourses, CurrentUserActions.loadedAllCourses, 'GET', ->
    url: '/api/courses'


  CurrentUserActions.logout.addListener 'trigger', ->
    $.ajax('/accounts/logout', {method: 'DELETE'})
    .always ->
      window.location.href = '/'


module.exports = {start}
