EventEmitter2 = require 'eventemitter2'
api = require '../api'
steps = {}
freeResponseCache = {}

_ = require 'underscore'

user = require '../user/model'

channel = new EventEmitter2 wildcard: true

STEP_TYPES =
  'free-response': ['free_response']
  'multiple-choice': ['answer_id', 'is_completed']


getStepsByTaskId = (taskId) ->
  _.where steps, {task_id: taskId}

quickLoad = (stepId, data) ->
  steps[stepId] = data
  channel.emit("quickLoad.#{stepId}", {data})

cacheFreeResponse = (stepId, freeResponse) ->
  freeResponseCache[stepId] = freeResponse

uncachedFreeResponse = (stepId) ->
  delete freeResponseCache[stepId] if freeResponseCache[stepId]?

load = (stepId, data) ->
  steps[stepId] = data
  channel.emit("load.#{stepId}", {data})

update = (eventData) ->
  {data} = eventData
  load(data.id, data)

fetch = (stepId) ->
  eventData = {data: {id: stepId}, status: 'loading'}

  channel.emit("fetch.#{stepId}", eventData)
  api.channel.emit("exercise.#{stepId}.send.fetch", eventData)

getCurrentPanel = (stepId) ->
  panel = 'review'

  step = steps[stepId]
  question = step?.content?.questions?[0]
  return panel unless question?

  {formats} = question

  _.find STEP_TYPES, (stepChecks, format) ->
    return false unless format in formats
    isStepCompleted = _.reduce stepChecks, (isOtherCompleted, currentCheck) ->
      step[currentCheck]? and step[currentCheck] and isOtherCompleted
    , true

    unless isStepCompleted
      panel = format
      true

  panel

get = (stepId) ->
  uncachedFreeResponse(stepId) if steps[stepId].free_response?
  steps[stepId].cachedFreeResponse = freeResponseCache[stepId]
  steps[stepId]

getAllParts = (stepId) ->
  step = steps[stepId]
  {task_id, content_url} = step

  stepsForTask = getStepsByTaskId(task_id)

  parts = _.filter stepsForTask, (part) ->
    part.is_in_multipart and part.content_url is content_url

  parts = [step] if _.isEmpty(parts)

  _.map parts, (part) ->
    get(part.id)

init = ->
  user.channel.on 'logout.received', ->
    steps = {}

  api.channel.on("exercise.*.receive.*", update)

module.exports = {fetch, getCurrentPanel, get, getAllParts, init, channel, quickLoad, cacheFreeResponse}
