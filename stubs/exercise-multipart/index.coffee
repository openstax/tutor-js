_ = require 'lodash'
steps = require './steps'

stepsStubs = {}

TASK_ID = '40'

commonInfo =
  content_url: 'https://exercises-dev.openstax.org/exercises/120@1'
  group: 'core'
  related_content: [
    title: 'Physics is cool, yo'
    chapter_section: '1.3'
  ]
  task_id: TASK_ID

assignStepToTask = (step, questionNumber) ->
  _.extend {questionNumber}, commonInfo, step


_.forEach steps, (step) ->
  stepStubs =
    'free-response': assignStepToTask _.omit(step, 'correct_answer_id', 'feedback_html'), 1
    'multiple-choice': assignStepToTask _.omit(step, 'correct_answer_id', 'feedback_html'), 2
    'review': assignStepToTask _.clone(step), 3

  stepsStubs[step.id] = stepStubs

module.exports = stepsStubs
