_ = require 'lodash'
steps = require './steps'

stepsStubs = {}

TASK_ID = '40'

assignTaskIdToStep = (step) ->
  _.extend {}, step, task_id: TASK_ID


_.forEach steps, (step) ->
  stepStubs =
    'free-response': assignTaskIdToStep _.omit(step, 'correct_answer_id')
    'multiple-choice': assignTaskIdToStep _.omit(step, 'correct_answer_id')
    'review': assignTaskIdToStep _.clone(step)

  stepsStubs[step.id] = stepStubs

module.exports = stepsStubs
