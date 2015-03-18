# This file manages all async state transitions.
#
# These attach to actions to help state changes along.
#
# For example, `TaskActions.load` everntually yields either
# `TaskActions.loaded` or `TaskActions.FAILED`

$ = require 'jquery'
_ = require 'underscore'
{CurrentUserActions, CurrentUserStore} = require './flux/current-user'
{TaskActions} = require './flux/task'
{TaskPlanActions, TaskPlanStore} = require './flux/task-plan'
{TocActions} = require './flux/toc'
{TeacherTaskPlanActions, TeacherTaskPlanStore} = require './flux/teacher-task-plan'

# HACK: until we get a course listing page
courseId = 1

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

      url = "#{url}.json" if IS_LOCAL

      resolved = (results) -> successAction(results, args...) # Include listenAction for faking
      rejected = (jqXhr, statusMessage, err) ->
        statusCode = jqXhr.status
        if statusCode is 400
          CurrentUserActions.logout()
        else if statusMessage is 'parsererror' and statusCode is 200 and IS_LOCAL
          if httpMethod is 'PUT'
            # HACK for PUT
            successAction(null, args...)
          else
            # Hack for local testing. Webserver returns 200 + HTML for 404's
            Actions.FAILED(404, 'Error Parsing the JSON or a 404', args...)
        else if statusCode is 404
          Actions.FAILED(statusCode, 'ERROR_NOTFOUND', args...)
        else
          # Parse the error message and fail
          msg = JSON.parse(jqXhr.responseText)
          Actions.FAILED(statusCode, msg, args...)


      $.ajax(url, opts)
      .then(resolved, rejected)

loadSaveHelper = (Actions, pathMaker) ->
  apiHelper(Actions, Actions.load, Actions.loaded, 'GET', pathMaker)
  apiHelper(Actions, Actions.save, Actions.saved, 'PATCH', pathMaker)


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

  apiHelper TocActions, TocActions.load, TocActions.loaded, 'GET', () ->
    url: "/api/courses/#{courseId}/readings"

  reloadAfterCompletion = (empty, task, step) ->
    TaskActions.load(task.id)

  apiHelper TaskActions, TaskActions.completeStep, reloadAfterCompletion, 'PUT', (task, step) ->
    console.warn('TODO: Refactor to use the TaskStep store directly')
    url: "/api/steps/#{step.id}/completed"

  apiHelper TaskActions, TaskActions.setFreeResponseAnswer, TaskActions.saved, 'PATCH', (task, step, free_response) ->
    console.warn('TODO: Refactor to use the TaskStep store directly')
    url: "/api/steps/#{step.id}"
    payload: {free_response}

  apiHelper TaskActions, TaskActions.setAnswerId, TaskActions.saved, 'PATCH', (task, step, answer_id) ->
    console.warn('TODO: Refactor to use the TaskStep store directly')
    url: "/api/steps/#{step.id}"
    payload: {answer_id}


  TaskActions.loadUserTasks.addListener 'trigger', ->
    url = '/api/user/tasks'
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


  CurrentUserActions.logout.addListener 'trigger', ->
    $.ajax('/accounts/logout', {method: 'DELETE'})
    .always ->
      window.location.href = '/'


module.exports = {start}
