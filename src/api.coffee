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
  listenAction.addListener 'trigger', (id, payload=null) ->
    url = pathMaker(id)
    opts =
      method: httpMethod
      dataType: 'json'
      headers:
        token: CurrentUserStore.getToken()
    if payload?
      opts.data = JSON.stringify(payload)
      opts.processData = false

    resolved = (results) -> successAction(id, results)
    rejected = (jqXhr, statusMessage, err) ->
      statusCode = jqXhr.status
      if statusCode is 400
        CurrentUserActions.logout()
      else if statusMessage is 'parsererror' and statusCode is 200
        # Hack for local testing. Webserver returns 200 + HTML for 404's
        Actions.FAILED(id, 404, 'Error Parsing the JSON or a 404')
      else if statusCode is 404
        Actions.FAILED(id, statusCode, 'ERROR_NOTFOUND')
      else
        # Parse the error message and fail
        msg = JSON.parse(jqXhr.responseText)
        Actions.FAILED(id, statusCode, msg)


    $.ajax(url, opts)
    .then(resolved, rejected)

loadSaveHelper = (Actions, pathMaker) ->
  apiHelper(Actions, Actions.load, Actions.loaded, 'GET', pathMaker)
  apiHelper(Actions, Actions.save, Actions.saved, 'PUT', pathMaker)


start = ->
  loadSaveHelper TaskActions, (id) -> "/api/tasks/#{id}"

  CurrentUserActions.logout.addListener 'trigger', ->
    $.ajax('/accounts/logout', {method: 'DELETE'})
    .always ->
      window.location.href = '/'


fetchUserTasks = ->
  url = '/api/user/tasks'
  opts =
    dataType: 'json'
    headers:
      token: CurrentUserStore.getToken()

  $.ajax(url, opts)
  .then (results) =>
    for task in results.items
      TaskActions.loaded(task.id, task)
    results


module.exports = {start, fetchUserTasks}
