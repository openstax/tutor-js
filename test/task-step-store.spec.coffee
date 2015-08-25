{expect} = require 'chai'
moment = require 'moment'
_ = require 'underscore'

{TimeStore} = require '../src/flux/time'
{TaskStepActions, TaskStepStore} = require '../src/flux/task-step'

LoadStepData = (properties = {}) ->
  step = _.extend(
    id: '1'
    task_id: '5'
    has_recovery: true
    correct_answer_id: 1
    answer_id: 2
  , properties )
  TaskStepActions.loaded(step, step.id)
  step

describe 'Task Step Store', ->
  beforeEach ->
    @task =
      due_at: moment(TimeStore.getNow()).add(1, 'minute').toDate()

  afterEach ->
    TaskStepActions.reset()

  describe 'try another', ->

    it 'is allowed if conditions are right', ->
      step = LoadStepData()
      expect(TaskStepStore.canTryAnother(step.id, @task)).to.be.true

    it 'is false if has_recovery is false', ->
      step = LoadStepData(has_recovery: false)
      expect(TaskStepStore.canTryAnother(step.id, @task)).to.be.false

    it 'is false if answer is correct', ->
      step = LoadStepData(correct_answer_id: '2', answer_id: '2')
      expect(TaskStepStore.canTryAnother(step.id, @task)).to.be.false

    it 'checks loading state', ->
      step = LoadStepData()
      TaskStepActions.load(step.id)
      expect(TaskStepStore.isLoading(step.id)).to.be.true
      expect(TaskStepStore.canTryAnother(step.id, @task)).to.be.false

    it 'checks saving state', ->
      step = LoadStepData()
      TaskStepActions.save(step.id)
      expect(TaskStepStore.isSaving(step.id)).to.be.true
      expect(TaskStepStore.canTryAnother(step.id, @task)).to.be.false

    it 'doesnt work on past due tasks', ->
      step = LoadStepData()
      @task.due_at = moment(TimeStore.getNow()).subtract(1, 'minute').toDate()
      expect(TaskStepStore.canTryAnother(step.id, @task)).to.be.false

    it 'doesnt work when recovering a task', ->
      step = LoadStepData()
      TaskStepActions.loadRecovery(step.id)
      expect(TaskStepStore.isRecovering(step.id)).to.be.true
      expect(TaskStepStore.canTryAnother(step.id, @task)).to.be.false
      TaskStepActions.loadedRecovery({}, step.id)
      expect(TaskStepStore.canTryAnother(step.id, @task)).to.be.true
