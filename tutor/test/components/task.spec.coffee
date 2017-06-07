{expect} = require 'chai'
_ = require 'underscore'

{taskActions, taskTests, taskChecks} = require './helpers/task'
{UiSettings} = require 'shared'
{CourseActions, CourseStore} = require '../../src/flux/course'
{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

COURSE_ID = '1'
COURSE    = require '../../api/user/courses/1.json'
TASK_ID = '4'
HOMEWORK_ID = '5'

VALID_MODEL = require '../../api/tasks/4.json'
HOMEWORK_MODEL = require '../../api/tasks/5.json'
VALID_RECOVERY_MODEL = require '../../api/tasks/4-recovered.json'
VALID_RECOVERY_STEP = require '../../api/steps/step-id-4-2/recovery/PUT.json'

FAKE_PLACEMENT =
  taskId: 'test'
  stepId: 'test'

describe 'Task Widget, Reading Task', ->
  beforeEach (done) ->
    UiSettings.initialize(
      "two-step-info-#{VALID_MODEL.type}": FAKE_PLACEMENT
      "spaced-practice-info-#{VALID_MODEL.type}": FAKE_PLACEMENT
      "personalized-info-#{VALID_MODEL.type}": FAKE_PLACEMENT
    )
    TaskActions.HACK_DO_NOT_RELOAD(true)
    TaskStepActions.HACK_DO_NOT_RELOAD(true)
    CourseActions.loaded(COURSE, COURSE_ID)

    TaskActions.loaded(VALID_MODEL, TASK_ID)

    taskTests
      .renderStep(TASK_ID, COURSE_ID)
      .then((result) =>
        @result = result
        done()
      , done)

  afterEach ->
    UiSettings._reset()
    taskTests.unmount()

    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()

    TaskActions.HACK_DO_NOT_RELOAD(false)
    TaskStepActions.HACK_DO_NOT_RELOAD(false)

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

  it 'should have continue button with "Continue" as text for continuing to next step', (done) ->
    taskTests
      .submitMultipleChoice(@result)
      .then(taskChecks.checkContinueButtonText('Continue'))
      .then( ->
        done()
      , done)

  xit 'should allow recovery when available and answer is incorrect', (done) ->
    taskTests
      .submitMultipleChoice(@result)
      .then( ->
        done()
      , done)


describe 'Task Widget, through routes', ->
  beforeEach (done) ->
    UiSettings.initialize(
      "two-step-info-#{VALID_MODEL.type}": FAKE_PLACEMENT
      "spaced-practice-info-#{VALID_MODEL.type}": FAKE_PLACEMENT
      "personalized-info-#{VALID_MODEL.type}": FAKE_PLACEMENT
      "two-step-info-#{HOMEWORK_MODEL.type}": FAKE_PLACEMENT
      "spaced-practice-info-#{HOMEWORK_MODEL.type}": FAKE_PLACEMENT
      "personalized-info-#{HOMEWORK_MODEL.type}": FAKE_PLACEMENT
    )

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
    UiSettings._reset()
    taskTests.unmount()

    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()

    TaskActions.HACK_DO_NOT_RELOAD(false)
    TaskStepActions.HACK_DO_NOT_RELOAD(false)

  # Tests for the "spacer" panels are moving to shared.

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
    TaskActions.loaded(HOMEWORK_MODEL, HOMEWORK_ID)

    # run a full step through and check each step
    taskTests
      .goToTask("/courses/#{COURSE_ID}/tasks/#{HOMEWORK_ID}", HOMEWORK_ID)
      .then(taskChecks.checkHasReviewableBreadcrumbs)
      .then( ->
        done()
      , done)

  it 'should be able to work through tasks and show progress', (done) ->
    # run a full step through and check each step

    taskActions
      .clickContinue(@result)
      .then(taskChecks.checkHasReadingProgressBar)
      .then( ->
        done()
      , done)

  it 'should show spaced practice label for a spaced practice group step', (done) ->
    # run a full step through and check each step

    taskActions
      .clickContinue(@result)
      .then(taskActions.completeThisStep)
      .then(taskActions.advanceStep)
      .then(taskActions.completeThisStep)
      .then(taskActions.advanceStep)
      .then(taskActions.clickContinue)
      .then(taskChecks.checkHasExpectedGroupLabel)
      .then( ->
        done()
      , done)


  # comment this out for now.  TODO fix and reimplement
  # it 'should show recovery step when try another is clicked', (done) ->

  #   taskActions
  #     .clickContinue(@result)
  #     .then(taskTests.submitMultipleChoice)
  #     .then(taskActions.clickTryAnother)
  #     .then(taskActions.loadRecovery('step-id-4-2-recovery', VALID_RECOVERY_STEP))
  #     .then(taskActions.loadTask(VALID_RECOVERY_MODEL))
  #     # .then(taskActions.forceRecovery)
  #     # .then(taskChecks.checkRecoveryContent)
  #     .then(_.delay(done, 1800)).catch(done)

  # This test no longer works since we'll always have at least some spaced practice
  xit 'should continue even if task has only a single step', (done) ->
    TaskActions.reset()
    model = _.clone(VALID_MODEL)
    model.steps = _.clone(VALID_MODEL.steps)
    model.steps.splice(1, model.steps.length)
    TaskActions.loaded(model, TASK_ID)
    expect(model.steps.length).to.equal(1)

    taskActions.completeSteps(@result)
      .then(taskChecks.checkIsCompletePage)
      .then( ->
        done()
      , done)

  it 'should show appropriate done page on completion', (done) ->
    # run a full step through and check each step
    taskActions
      .clickContinue(@result)
      .then(taskActions.completeThisStep)
      .then(taskActions.advanceStep)
      .then(taskActions.completeThisStep)
      .then(taskActions.advanceStep)
      .then(taskActions.clickContinue)
      .then(taskActions.clickContinue)
      .then(taskActions.completeThisStep)
      .then(taskActions.advanceStep)
      .then(taskActions.completeThisStep)
#      .then(taskChecks.checkIsCompletePage) # FIXME - why cant we advance past the prior exercise ?
      .then( ->
        done()
      , done)
