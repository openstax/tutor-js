# This file manages all async state transitions.
#
# These attach to actions to help state changes along.
#
# For example, `TaskActions.load` everntually yields either
# `TaskActions.loaded` or `TaskActions.FAILED`

$ = require 'jquery'
{CurrentUserActions, CurrentUserStore} = require './flux/current-user'
{TaskActions} = require './flux/task'

apiHelper = (Actions, listenAction, successAction, httpMethod, pathMaker) ->
  listenAction.addListener 'trigger', (args...) ->
    {url, payload} = pathMaker(args...)
    opts =
      method: httpMethod
      dataType: 'json'
      headers:
        token: CurrentUserStore.getToken()
    if payload?
      opts.data = JSON.stringify(payload)
      opts.processData = false

    resolved = (results) -> successAction(results, args...) # Include listenAction for faking
    rejected = (jqXhr, statusMessage, err) ->
      statusCode = jqXhr.status
      if statusCode is 400
        CurrentUserActions.logout()
      else if statusMessage is 'parsererror' and statusCode is 200
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

  reloadAfterCompletion = (empty, task, step) ->
    TaskActions.load(task.id)

  apiHelper TaskActions, TaskActions.completeStep, reloadAfterCompletion, 'PUT', (task, step) ->
    url: "/api/tasks/#{task.id}/steps/#{step.id}/completed"

  apiHelper TaskActions, TaskActions.setFreeResponseAnswer, TaskActions.saved, 'PATCH', (task, step, free_response) ->
    url: "/api/tasks/#{task.id}/steps/#{step.id}"
    payload: {free_response}

  apiHelper TaskActions, TaskActions.setAnswerId, TaskActions.saved, 'PATCH', (task, step, answer_id) ->
    url: "/api/tasks/#{task.id}/steps/#{step.id}"
    payload: {answer_id}


  TaskActions.loadUserTasks.addListener 'trigger', ->
    url = '/api/user/tasks'
    opts =
      dataType: 'json'
      headers:
        token: CurrentUserStore.getToken()

    $.ajax(url, opts)
    .then (results) ->
      TaskActions.loadedUserTasks(results.items)


  CurrentUserActions.logout.addListener 'trigger', ->
    $.ajax('/accounts/logout', {method: 'DELETE'})
    .always ->
      window.location.href = '/'


module.exports = {start}
