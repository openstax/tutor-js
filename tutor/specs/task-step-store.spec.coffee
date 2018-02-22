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
  task = {}

  beforeEach ->
    task =
      due_at: moment(TimeStore.getNow()).add(1, 'minute').toDate()

  afterEach ->
    TaskStepActions.reset()

  describe 'try another', ->

    it 'is allowed if conditions are right', ->
      step = LoadStepData()
      expect(TaskStepStore.canTryAnother(step.id, task)).to.be.true
      undefined

    it 'is false if has_recovery is false', ->
      step = LoadStepData(has_recovery: false)
      expect(TaskStepStore.canTryAnother(step.id, task)).to.be.false
      undefined

    it 'is false if answer is correct', ->
      step = LoadStepData(correct_answer_id: '2', answer_id: '2')
      expect(TaskStepStore.canTryAnother(step.id, task)).to.be.false
      undefined

    it 'checks loading state', ->
      step = LoadStepData()
      TaskStepActions.load(step.id)
      expect(TaskStepStore.isLoading(step.id)).to.be.true
      expect(TaskStepStore.canTryAnother(step.id, task)).to.be.false
      undefined

    it 'checks saving state', ->
      step = LoadStepData()
      TaskStepActions.save(step.id)
      expect(TaskStepStore.isSaving(step.id)).to.be.true
      expect(TaskStepStore.canTryAnother(step.id, task)).to.be.false
      undefined

    it 'doesnt work on past due tasks', ->
      step = LoadStepData()
      task.due_at = moment(TimeStore.getNow()).subtract(1, 'minute').toDate()
      expect(TaskStepStore.canTryAnother(step.id, task)).to.be.false
      undefined

    it 'isRecovering updates when recovering a task', ->
      step = LoadStepData()
      expect(TaskStepStore.isRecovering(step.id)).to.be.false
      TaskStepActions.loadRecovery(step.id)
      expect(TaskStepStore.isRecovering(step.id)).to.be.true
      expect(TaskStepStore.canTryAnother(step.id, task)).to.be.true
      TaskStepActions.loadedRecovery({id: 'RECOVERED_STEP'}, step.id)
      expect(TaskStepStore.isRecovering(step.id)).to.be.true
      TaskStepActions.loaded({id: 'RECOVERED_STEP'}, 'RECOVERED_STEP')
      expect(TaskStepStore.isRecovering(step.id)).to.be.false
      undefined
