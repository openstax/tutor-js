EventEmitter2 = require 'eventemitter2'
api = require '../api'

steps = {}
channel = new EventEmitter2 wildcard: true

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
  step = steps[stepId]
  panel = 'free-response'
  if step.correct_answer_id?
    panel = 'review'
  else if step.free_response?
    panel = 'multiple-choice'
  panel

getProps = (stepId) ->
  step = steps[stepId] or {content: {questions:[{formats:[]}]}}
  steps[stepId] ?= step

  props =
    taskId: step.task_id
    step: step
    getCurrentPanel: getCurrentPanel

    setAnswerId: (stepId, answerId) ->
      step.answer_id = answerId
      eventData = change: step, data: step, status: 'saving'

      channel.emit("change.#{stepId}", eventData)
      api.channel.emit("exercise.#{stepId}.send.save", eventData)

    setFreeResponseAnswer: (stepId, freeResponse) ->
      step.free_response = freeResponse
      eventData = change: step, data: step, status: 'saving'

      channel.emit("change.#{stepId}", eventData)
      api.channel.emit("exercise.#{stepId}.send.save", eventData)

    onContinue: ->
      step.is_completed = true
      eventData = change: step, data: step, status: 'loading'

      channel.emit("change.#{stepId}", eventData)
      api.channel.emit("exercise.#{stepId}.send.complete", eventData)

    onStepCompleted: ->
      console.info('onStepCompleted')
    onNextStep: ->
      console.info('onNextStep')

api.channel.on("exercise.*.receive.*", update)

module.exports = {fetch, getCurrentPanel, getProps, channel}
