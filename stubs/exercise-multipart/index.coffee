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

# stem and stimulus here as well to replicate real JSON
commonContent =
  stimulus_html: 'This stim should only show up once.'
  stem_html: 'This stem should only show up once.'
  uid: '120@1'

assignStepToTask = (step, questionNumber) ->
  step.content = _.extend {}, commonContent, step.content
  _.extend {questionNumber}, commonInfo, step


_.forEach steps, (step) ->
  stepStubs =
    'free-response': assignStepToTask _.omit(step, 'correct_answer_id', 'feedback_html'), 1
    'multiple-choice': assignStepToTask _.omit(step, 'correct_answer_id', 'feedback_html'), 2
    'review': assignStepToTask _.clone(step), 3

  console.info(JSON.stringify(stepStubs['free-response']))

  stepsStubs[step.id] = stepStubs

module.exports = stepsStubs
