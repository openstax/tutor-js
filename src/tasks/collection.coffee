EventEmitter2 = require 'eventemitter2'
api = require '../api'

tasks = {}
channel = new EventEmitter2 wildcard: true

load = (taskId, data) ->
  tasks[taskId] = data
  channel.emit("load.#{taskId}", {data})

fetch = (taskId) ->
  eventData = {data: {id: taskId}, status: 'loading'}

  channel.emit("fetch.#{taskId}", eventData)
  api.channel.emit("task.#{taskId}.send.fetch", eventData)

fetchByModule = (collectionUUID, moduleUUID) ->
  eventData = {data: {collectionUUID, moduleUUID}, status: 'loading'}

  channel.emit("fetch.#{collectionUUID}/#{moduleUUID}", eventData)
  api.channel.emit("task.#{collectionUUID}/#{moduleUUID}.send.fetchByModule", eventData)

module.exports = {load, fetch, fetchByModule, channel}
