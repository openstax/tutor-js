EventEmitter2 = require 'eventemitter2'
interpolate = require 'interpolate'
_ = require 'underscore'
api = require '../api'
exercises = require '../exercise/collection'

tasks = {}
channel = new EventEmitter2 wildcard: true

ERRORS_TO_SILENCE = ['page_has_no_exercises']

getUnhandledErrors = (errors) ->
  otherErrors = _.reject errors, (error) ->
    _.indexOf(ERRORS_TO_SILENCE, error.code) > -1

handledAllErrors = (otherErrors) ->
  _.isEmpty otherErrors

checkFailure = (response) ->
  if response.data.errors
    response.data.errors = getUnhandledErrors(response.data.errors)
    response.stopErrorDisplay = handledAllErrors(response.data.errors)

load = (taskId, data) ->
  tasks[taskId] = data
  status = if data.errors? then 'failed' else 'loaded'

  _.each data.steps, (step) ->
    exercises.quickLoad(step.id, step)

  channel.emit("load.#{taskId}", {data, status})

update = (eventData) ->
  return unless eventData?
  {data, query} = eventData
  load(query, data)

fetch = (taskId) ->
  eventData = {data: {id: taskId}, status: 'loading'}
  eventData.query = taskId

  channel.emit("fetch.#{taskId}", eventData)
  api.channel.emit("task.#{taskId}.send.fetch", eventData)

fetchByModule = ({collectionUUID, moduleUUID}) ->
  eventData = {data: {collectionUUID, moduleUUID}, status: 'loading'}
  eventData.query = "#{collectionUUID}/#{moduleUUID}"

  channel.emit("fetch.#{collectionUUID}/#{moduleUUID}", eventData)
  api.channel.emit("task.#{collectionUUID}/#{moduleUUID}.send.fetchByModule", eventData)

get = (taskId) ->
  tasks[taskId]

getCompleteSteps = (taskId) ->
  _.filter(tasks[taskId].steps, (step) ->
    step? and step.is_completed
  )

getIncompleteSteps = (taskId) ->
  _.filter(tasks[taskId].steps, (step) ->
    step? and not step.is_completed
  )

getFirstIncompleteIndex = (taskId) ->
  _.max [_.findIndex(tasks[taskId]?.steps, {is_completed: false}), 0]

getStepIndex = (taskId, stepId) ->
  _.findIndex(tasks[taskId].steps, id: stepId)

getModuleInfo = (taskId, cnxUrl = '') ->
  task = tasks[taskId]
  return unless task?

  moduleUrlPattern = '{cnxUrl}/contents/{collectionUUID}/{moduleUUID}'
  {collectionUUID, moduleUUID} = task

  moduleInfo = _.clone(task.steps?[0].related_content?[0]) or {}
  _.extend moduleInfo, _.pick(task, 'collectionUUID', 'moduleUUID')
  moduleInfo.link = interpolate moduleUrlPattern, {cnxUrl, collectionUUID, moduleUUID}

  moduleInfo

api.channel.on("task.*.receive.*", update)
api.channel.on('task.*.receive.failure', checkFailure)

module.exports = {
  load,
  fetch,
  fetchByModule,
  get,
  getCompleteSteps,
  getIncompleteSteps,
  getFirstIncompleteIndex,
  getStepIndex,
  getModuleInfo,
  channel
}
