{expect} = require 'chai'
_ = require 'underscore'

{taskActions, taskTests, taskChecks} = require './helpers/task'

{CourseActions, CourseStore} = require '../../src/flux/course'
{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

{SinglePractice, Tasks} = require '../../src/components'

COURSE_ID = '1'
COURSE    = require '../../api/user/courses/1.json'
TASK_ID = '4'

VALID_MODEL = require '../../api/tasks/4.json'
VALID_RECOVERY_MODEL = require '../../api/tasks/4-recovered.json'
VALID_RECOVERY_STEP = require '../../api/steps/step-id-4-2/recovery/PUT.json'

describe 'Task Widget', ->
  beforeEach (done) ->
    TaskActions.HACK_DO_NOT_RELOAD(true)
    TaskStepActions.HACK_DO_NOT_RELOAD(true)

    TaskActions.loaded(VALID_MODEL, TASK_ID)

    taskTests
      .renderStep(TASK_ID)
      .then((result) =>
        @result = result
        done()
      , done)

  afterEach ->
    taskTests.unmount()

    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()

    TaskActions.HACK_DO_NOT_RELOAD(false)
    TaskStepActions.HACK_DO_NOT_RELOAD(false)

  # _.delay needed to prevent weird problems.
  it 'should render empty free response for unanswered exercise', (done) ->
    taskChecks
      .checkRenderFreeResponse(@result)
      .then( ->
        done()
      , done)

  it 'should update store when free response is submitted', (done) ->
    taskTests
      .answerFreeResponse(@result)
      .then(taskActions.clickContinue)
      .then(taskChecks.checkAnswerFreeResponse)
      .then( ->
        done()
      , done)

  it 'should render multiple choice after free response', (done) ->
    taskTests
      .submitFreeResponse(@result)
      .then(taskChecks.checkSubmitFreeResponse)
      .then( ->
        done()
      , done)

  it 'should update store when multiple choice answer is chosen', (done) ->
    taskTests
      .answerMultipleChoice(@result)
      .then(taskChecks.checkAnswerMultipleChoice)
      .then( ->
        done()
      , done)

  it 'should render an answer and feedback html for an answered question', (done) ->
    taskTests
      .submitMultipleChoice(@result)
      .then(taskChecks.checkSubmitMultipleChoice)
      .then( ->
        done()
      , done)

  xit 'should allow recovery when available and answer is incorrect', (done) ->
    taskTests
      .submitMultipleChoice(@result)
      .then(taskChecks.checkRecoveryRefreshChoice)
      .then( ->
        done()
      , done)


describe 'Task Widget, through routes', ->
  beforeEach (done) ->
    CourseActions.loaded(COURSE, COURSE_ID)

    TaskActions.HACK_DO_NOT_RELOAD(true)
    TaskStepActions.HACK_DO_NOT_RELOAD(true)
    TaskActions.loaded(VALID_MODEL, TASK_ID)
    taskTests
      .goToTask("/courses/#{COURSE_ID}/tasks/#{TASK_ID}", TASK_ID)
      .then((result) =>
        @result = result
        done()
      , done)

  afterEach ->
    taskTests.unmount()

    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()

    TaskActions.HACK_DO_NOT_RELOAD(false)
    TaskStepActions.HACK_DO_NOT_RELOAD(false)

  it 'should be render a spacer panel for the non-core step', (done) ->
    # run a full step through and check each step

    taskChecks
      .checkIsSpacerPanel(@result)
      .then( ->
        done()
      , done)

  it 'should be able to work through a task and load next step from a route', (done) ->
    # run a full step through and check each step

    taskActions
      .clickContinue(@result)
      .then(taskTests.workExerciseAndCheck)
      .then(taskActions.clickContinue)
      .then(taskChecks.checkIsNextStep)
      .then(taskActions.advanceStep)
      .then( ->
        done()
      , done)

  it 'should be able to work through tasks and show progressing breadcrumbs', (done) ->
    # run a full step through and check each step

    taskActions
      .clickContinue(@result)
      .then(taskActions.completeThisStep)
      .then(taskActions.advanceStep)
      .then(taskChecks.checkHasReviewableBreadcrumbs)
      .then(taskActions.completeThisStep)
      .then(taskActions.advanceStep)
      .then(taskChecks.checkHasReviewableBreadcrumbs)
      .then( ->
        done()
      , done)

  it 'should show spaced practice label for a spaced practice group step', (done) ->
    # run a full step through and check each step

    taskActions
      .clickContinue(@result)
      .then(taskChecks.checkHasExpectedGroupLabel)
      .then(taskActions.completeThisStep)
      .then(taskActions.advanceStep)
      .then(taskActions.completeThisStep)
      .then(taskActions.advanceStep)
      .then(taskActions.completeThisStep)
      .then(taskActions.advanceStep)
      .then(taskChecks.checkHasExpectedGroupLabel)
      .then( ->
        done()
      , done)


  # comment this out for now.  TODO fix and reimplement
  # it 'should show recovery step when try another is clicked', (done) ->

  #   taskActions
  #     .clickContinue(@result)
  #     .then(taskTests.submitMultipleChoice)
  #     .then(taskChecks.checkRecoveryRefreshChoice)
  #     .then(taskActions.clickTryAnother)
  #     .then(taskActions.loadRecovery('step-id-4-2-recovery', VALID_RECOVERY_STEP))
  #     .then(taskActions.loadTask(VALID_RECOVERY_MODEL))
  #     # .then(taskActions.forceRecovery)
  #     # .then(taskChecks.checkRecoveryContent)
  #     .then(_.delay(done, 1800)).catch(done)

  it 'should continue even if task has only a single step', (done) ->
    TaskActions.reset()
    model = _.clone(VALID_MODEL)
    model.steps = _.clone(VALID_MODEL.steps)
    model.steps.splice(1, model.steps.length)
    TaskActions.loaded(model, TASK_ID)
    expect(model.steps.length).to.equal(1)

    taskActions
      .clickContinue(@result)
      .then(taskActions.completeSteps)
      .then(taskChecks.checkIsCompletePage)
      .then( ->
        done()
      , done)

  it 'should show appropriate done page on completion', (done) ->
    # run a full step through and check each step
    taskActions
      .clickContinue(@result)
      .then(taskActions.completeSteps)
      .then(taskChecks.checkIsCompletePage)
      .then( ->
        done()
      , done)
