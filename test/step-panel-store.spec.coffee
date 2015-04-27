{expect} = require 'chai'
_ = require 'underscore'
moment = require 'moment'

{TaskActions, TaskStore} = require '../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../src/flux/task-step'
{TaskPlanActions, TaskPlanStore} = require '../src/flux/task-plan'
{StepPanelStore} = require '../src/flux/step-panel'

# fake model stuffs for homework, late homework, reading, and practice
homeworkTaskId = 6
homework_model = require '../api/tasks/6.json'
homework_model.due_at = moment().add(1, 'year').toDate()

late_homework_model = _.clone(homework_model)
late_homework_model.due_at = moment().subtract(1, 'year').toDate()
lateHomeworkId = 7

stepIds = _.pluck(homework_model.steps, 'id')
answerId = homework_model.steps[0].content.questions[0].answers[0].id

readingTaskId = 4
fake_reading_model = require '../api/tasks/4.json'

practiceTaskId = 8
fake_practice_model = require '../api/courses/1/practice.json'

models = {}
models[lateHomeworkId] = late_homework_model
models[readingTaskId] = fake_reading_model
models[practiceTaskId] = fake_practice_model

# fake complete step
fakeComplete = (stepId) ->
  taskStep = TaskStepStore.get(stepId)
  taskStep.is_completed = true
  TaskStepActions.loaded(taskStep, stepId)

# test for exercise step based on task id so that these tests can be repeated for different tasks
testForExerciseStepWithReview = (taskId) ->
  () ->
    beforeEach ->
      TaskActions.loaded(models[taskId], taskId)
      steps = TaskStore.getSteps(taskId)
      firstUnansweredExercise = _.find steps, (step) ->
        (step.type is 'exercise') and not step.is_completed

      answerId = firstUnansweredExercise.content.questions[0].answers[0].id
      stepId = firstUnansweredExercise.id

      @answerId = answerId
      @stepId = stepId

    afterEach ->
      TaskActions.reset()
      TaskStepActions.reset()


    it 'should return free-response and multiple-choice as available panels', ->
      panels = StepPanelStore.getPanelsWithStatus @stepId

      expect(panels.length).to.equal(3)
      expect(panels[0].name).to.equal('free-response')
      expect(panels[1].name).to.equal('multiple-choice')
      expect(panels[2].name).to.equal('review')

    it 'should allow review for past due homework', ->
      canReview = StepPanelStore.canReview @stepId

      expect(canReview).to.equal(true)

    it 'should return multiple-choice as the panel after free-response answered', ->
      TaskStepActions.setFreeResponseAnswer @stepId, 'Hello!'
      panel = StepPanelStore.getPanel @stepId

      expect(panel).to.equal('multiple-choice')

    it 'should return multiple-choice as the panel after multiple-choice answered', ->
      TaskStepActions.setFreeResponseAnswer @stepId, 'Hello!'
      TaskStepActions.setAnswerId @stepId, @answerId
      panel = StepPanelStore.getPanel @stepId

      expect(panel).to.equal('multiple-choice')

    it 'should return review as the panel after completed', ->
      TaskStepActions.setFreeResponseAnswer @stepId, 'Hello!'
      TaskStepActions.setAnswerId @stepId, @answerId
      fakeComplete @stepId

      panel = StepPanelStore.getPanel @stepId

      expect(panel).to.equal('review')



describe 'Step Panel Store, homework before due', ->
  beforeEach ->
    TaskActions.loaded(homework_model, homeworkTaskId)

  afterEach ->
    TaskActions.reset()
    TaskStepActions.reset()

  it 'should return free-response and multiple-choice as available panels', ->
    panels = StepPanelStore.getPanelsWithStatus(stepIds[0])

    expect(panels.length).to.equal(2)
    expect(panels[0].name).to.equal('free-response')
    expect(panels[1].name).to.equal('multiple-choice')

  it 'should return multiple-choice as the panel after free-response answered', ->
    TaskStepActions.setFreeResponseAnswer(stepIds[0], 'Hello!')
    panel = StepPanelStore.getPanel(stepIds[0])

    expect(panel).to.equal('multiple-choice')

  it 'should return multiple-choice as the panel after multiple-choice answered', ->
    TaskStepActions.setFreeResponseAnswer(stepIds[0], 'Hello!')
    TaskStepActions.setAnswerId(stepIds[0], answerId)
    panel = StepPanelStore.getPanel(stepIds[0])

    expect(panel).to.equal('multiple-choice')

  it 'should return multiple-choice as the panel after completed', ->
    TaskStepActions.setFreeResponseAnswer(stepIds[0], 'Hello!')
    TaskStepActions.setAnswerId(stepIds[0], answerId)
    fakeComplete(stepIds[0])

    panel = StepPanelStore.getPanel(stepIds[0])

    expect(panel).to.equal('multiple-choice')

describe 'Step Panel Store, reading, view non-exercise', ->
  beforeEach ->
    TaskActions.loaded(fake_reading_model, readingTaskId)

  afterEach ->
    TaskActions.reset()
    TaskStepActions.reset()

  it 'should return view panel for a non-exercise step', ->
    stepId = 'step-id-4-3'
    panel = StepPanelStore.getPanel(stepId)
    taskStep = TaskStepStore.get(stepId)

    expect(taskStep.type).to.not.equal('exercise')
    expect(panel).to.equal('view')

describe 'Step Panel Store, homework after due', testForExerciseStepWithReview(lateHomeworkId)

describe 'Step Panel Store, reading', testForExerciseStepWithReview(readingTaskId)

describe 'Step Panel Store, practice', testForExerciseStepWithReview(practiceTaskId)
