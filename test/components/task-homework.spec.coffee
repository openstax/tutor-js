# Tests for homework specific tasks

{expect} = require 'chai'
_ = require 'underscore'
moment = require 'moment'

{taskActions, taskTests, taskChecks} = require './helpers/task'

{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

courseId = '1'
homeworkTaskId = '6'
targetStepIndex = 1
homework_model = require '../../api/tasks/6.json'
homework_model.due_at = moment().add(1, 'year').toDate()

describe 'Task Widget, homework specific things, due in the future', ->
  beforeEach (done) ->
    TaskActions.HACK_DO_NOT_RELOAD(true)
    TaskStepActions.HACK_DO_NOT_RELOAD(true)

    TaskActions.loaded(homework_model, homeworkTaskId)

    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{homeworkTaskId}", homeworkTaskId)
      .then((result) =>
        @result = result
        done()
      , done)

  afterEach ->
    taskTests.unmount()

    TaskActions.reset()
    TaskStepActions.reset()

    TaskActions.HACK_DO_NOT_RELOAD(false)
    TaskStepActions.HACK_DO_NOT_RELOAD(false)

  it 'should render next screen when Continue is clicked', (done) ->
    # Using homework because this one has no completed steps
    # and therefore actually has an intro screen
    taskChecks.checkIsDefaultStep(@result)
      .then( ->
        done()
      , done)

  it 'should be able to work through a step in homework', (done) ->
    # run a full step through and check each step
    taskTests
      .renderStep(homeworkTaskId)
      .then(taskTests.workExerciseAndCheck)
      .then( ->
        done()
      , done)

  it 'should not be able view feedback after completing a step', (done) ->
    # run a full step through and check for feedback
    taskActions
      .fillFreeResponse(@result)
      .then(taskActions.saveFreeResponse)
      .then(taskActions.pickMultipleChoice)
      .then(taskActions.saveMultipleChoice)
      .then(taskChecks.checkNotFeedback)
      .then( ->
        done()
      , done)

  it 'should be able to work through a true-false question', (done) ->
    taskTests
      .workExercise(@result)
      .then(taskActions.clickContinue)
      .then(taskTests.workExercise)
      .then(taskActions.clickContinue)
      .then(taskChecks.workTrueFalseAndCheck)
      .then( ->
        done()
      , done)

  it 'should show homework done page on homework completion', (done) ->
    taskActions
      .completeSteps(@result)
      .then(taskChecks.checkIsCompletePage)
      .then( ->
        done()
      , done)

  it 'should allow viewing any step with breadcrumbs', (done) ->
    taskActions
      .completeSteps(@result)
      .then(taskActions.clickBreadcrumb(targetStepIndex))
      .then(taskChecks.checkIsMatchStep(targetStepIndex))
      .then(taskChecks.checkIsNotCompletePage)
      .then( ->
        done()
      , done)

  it 'should format the details page using markdown (for now)', (done) ->
    taskActions
      .clickDetails(@result)
      .then(taskChecks.checkIsPopoverOpen)
      .then( ->
        done()
      , done)

  it 'should show breadcrumbs for all steps', (done) ->
    taskChecks
      .checkAreAllStepsShowing(@result)
      .then( ->
        done()
      , done)

  it 'should show last step when last problem is clicked', (done) ->
    steps = TaskStore.getStepsIds(homeworkTaskId)
    lastStepIndex = steps.length - 1

    taskActions
      .clickBreadcrumb(lastStepIndex)(@result)
      .then(taskChecks.checkIsMatchStep(lastStepIndex))
      .then( ->
        done()
      , done)

  it 'should show complete page when complete page is clicked', (done) ->
    steps = TaskStore.getStepsIds(homeworkTaskId)
    completeStepIndex = steps.length

    taskActions
      .clickBreadcrumb(completeStepIndex)(@result)
      .then(taskChecks.checkIsCompletePage)
      .then( ->
        done()
      , done)

  it 'should show all breadcrumbs for homework', (done) ->
    taskChecks
      .checkHasAllBreadcrumbs(@result)
      .then( ->
        done()
      , done)
