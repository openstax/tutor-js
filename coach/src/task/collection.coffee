EventEmitter2 = require 'eventemitter2'
interpolate = require 'interpolate'
_ = require 'underscore'
api = require '../api'
exercises = require '../exercise/collection'

tasks = {}
lastError = {}
user = require '../user/model'

channel = new EventEmitter2 wildcard: true

getLastError = ->
  lastError

load = (taskId, data) ->
  tasks[taskId] = data

  status = if not data or data.errors? then 'failed' else 'loaded'

  _.each data?.steps, (step) ->
    exercises.quickLoad(step.id, step)
  lastError = data.errors?[0]

  channel.emit("load.#{taskId}", {data, status})

update = (eventData) ->
  return unless eventData?
  {data, config, response} = eventData
  load(config.topic, data or response?.data)

fetch = (taskId) ->
  eventData = {data: {id: taskId}, status: 'loading'}
  eventData.topic = taskId

  channel.emit("fetch.#{taskId}", eventData)
  api.channel.emit("task.#{taskId}.fetch.send", {id: taskId})

fetchByModule = ({collectionUUID, moduleUUID}) ->
  eventData = {data: {collectionUUID, moduleUUID}, status: 'loading'}
  eventData.topic = "#{collectionUUID}/#{moduleUUID}"

  channel.emit("fetch.#{collectionUUID}/#{moduleUUID}", eventData)
  api.channel.emit("task.#{collectionUUID}/#{moduleUUID}.fetchByModule.send", {collectionUUID, moduleUUID})

get = (taskId) ->
  tasks[taskId]

getCompleteSteps = (taskId) ->
  _.filter(tasks[taskId]?.steps, (step) ->
    step? and step.is_completed
  )

getIncompleteSteps = (taskId) ->
  _.filter(tasks[taskId]?.steps, (step) ->
    step? and not step.is_completed
  )

getFirstIncompleteIndex = (taskId) ->
  _.max [_.findIndex(tasks[taskId]?.steps, {is_completed: false}), 0]

getStepIndex = (taskId, stepId) ->
  _.findIndex(tasks[taskId]?.steps, id: stepId)

getModuleInfo = (taskId, cnxUrl = '') ->
  task = tasks[taskId]
  return unless task?

  moduleUrlPattern = '{cnxUrl}/contents/{collectionUUID}:{moduleUUID}'
  {collectionUUID, moduleUUID} = task

  moduleInfo = _.clone(task.steps?[0].related_content?[0]) or {}
  _.extend moduleInfo, _.pick(task, 'collectionUUID', 'moduleUUID')
  moduleInfo.link = interpolate moduleUrlPattern, {cnxUrl, collectionUUID, moduleUUID}

  moduleInfo

getAsPage = (taskId) ->
  task = get(taskId)
  {moduleUUID, steps} = task

  page = _.pick task, 'last_worked_at', 'id'
  _.extend page, _.first(_.first(steps).related_content)
  page.exercises = steps
  page.uuid = moduleUUID

  page

init = ->
  user.channel.on 'change', ->
    tasks = {}

  api.channel.on('task.*.*.receive.*', update)
  api.channel.on('exercise.*.complete.receive.success', update)

module.exports = {
  init,
  load,
  fetch,
  fetchByModule,
  get,
  getCompleteSteps,
  getIncompleteSteps,
  getFirstIncompleteIndex,
  getStepIndex,
  getModuleInfo,
  getAsPage,
  channel,
  getLastError
}
