EventEmitter2 = require 'eventemitter2'
_ = require 'underscore'
api = require '../api'

tasks = {}
channel = new EventEmitter2 wildcard: true

load = (taskId, data) ->
  tasks[taskId] = data
  channel.emit("load.#{taskId}", {data})

update = (eventData) ->
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

api.channel.on("task.*.receive.*", update)

module.exports = {
  load,
  fetch,
  fetchByModule,
  get,
  getCompleteSteps,
  getIncompleteSteps,
  getFirstIncompleteIndex,
  channel
}
