{expect} = require 'chai'
_ = require 'underscore'

{taskActions, taskTests, taskChecks} = require './helpers/task'

{CourseActions, CourseStore} = require '../../src/flux/course'
{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

{SinglePractice, Tasks} = require '../../src/components'

courseId = 1
taskId = 4

VALID_MODEL = require '../../api/tasks/4.json'
homework_model = require '../../api/tasks/5.json'

describe 'Task Widget', ->
  beforeEach ->
    TaskActions.loaded(VALID_MODEL, taskId)

  afterEach ->
    taskTests.unmount()

    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()

  it 'should allow students to continue tasks', (done) ->
    # Using homework because this one has no completed steps
    # and therefore actually has an intro screen
    homeworkTaskId = 5
    TaskActions.loaded(homework_model, homeworkTaskId)

    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{homeworkTaskId}", homeworkTaskId)
      .then(taskChecks.checkIsIntroScreen)
      .then(taskChecks.checkAllowContinue)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should render next screen when Continue is clicked', (done) ->
    # Using homework because this one has no completed steps
    # and therefore actually has an intro screen
    homeworkTaskId = 5
    TaskActions.loaded(homework_model, homeworkTaskId)

    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{homeworkTaskId}", homeworkTaskId)
      .then(taskActions.clickContinue)
      .then(taskChecks.checkIsNotIntroScreen)
      .then(taskChecks.heckIsDefaultStep)
      .then(_.delay(done, taskTests.delay)).catch(done)



  # _.delay needed to prevent weird problems.
  it 'should render empty free response for unanswered exercise', (done)->
    taskTests
      .renderFreeResponse(taskId)
      .then(taskChecks.checkRenderFreeResponse)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should update store when free response is submitted', (done) ->
    taskTests
      .answerFreeResponse(taskId)
      .then(taskActions.clickContinue)
      .then(taskChecks.checkAnswerFreeResponse)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should render multiple choice after free response', (done) ->
    taskTests
      .submitFreeResponse(taskId)
      .then(taskChecks.checkSubmitFreeResponse)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should update store when multiple choice answer is chosen', (done) ->
    taskTests
      .answerMultipleChoice(taskId)
      .then(taskChecks.checkAnswerMultipleChoice)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should render an answer and feedback html for an answered question', (done) ->
    taskTests
      .submitMultipleChoice(taskId)
      .then(taskChecks.checkSubmitMultipleChoice)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should be able to work through a step in homework', (done) ->
    homeworkTaskId = 5
    TaskActions.loaded(homework_model, homeworkTaskId)

    # run a full step through and check each step
    taskTests
      .renderStep(homeworkTaskId)
      .then(taskTests.workExerciseAndCheck)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should be able to work through a task and load next step from a route', (done) ->
    # run a full step through and check each step
    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{taskId}", taskId)
      .then(taskActions.clickContinue)
      .then(taskTests.workExerciseAndCheck)
      .then(taskActions.clickContinue)
      .then(taskChecks.checkIsNextStep)
      .then(taskActions.advanceStep)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should show appropriate done page on completion', (done) ->
    # run a full step through and check each step
    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{taskId}", taskId)
      .then(taskActions.clickContinue)
      .then(taskActions.completeSteps)
      .then(taskChecks.checkIsCompletePage)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should be able to work through a true-false question', (done) ->
    homeworkTaskId = 5
    TaskActions.loaded(homework_model, homeworkTaskId)

    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{homeworkTaskId}", homeworkTaskId)
      .then(taskActions.clickContinue)
      .then(taskTests.workExercise)
      .then(taskActions.clickContinue)
      .then(taskTests.workExercise)
      .then(taskActions.clickContinue)
      .then(taskChecks.workTrueFalseAndCheck)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should show homework done page on homework completion', (done) ->
    homeworkTaskId = 5
    TaskActions.loaded(homework_model, homeworkTaskId)

    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{homeworkTaskId}", homeworkTaskId)
      .then(taskActions.clickContinue)
      .then(taskActions.completeSteps)
      .then(taskChecks.checkIsCompletePage)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should allow review completed steps with breadcrumbs', (done) ->
    homeworkTaskId = 5
    TaskActions.loaded(homework_model, homeworkTaskId)
    targetStepIndex = 1

    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{homeworkTaskId}", homeworkTaskId)
      .then(taskActions.clickContinue)
      .then(taskActions.completeSteps)
      .then(taskActions.clickBreadcrumb(targetStepIndex))
      .then(taskChecks.checkIsMatchStep(targetStepIndex))
      .then(taskChecks.checkIsNotCompletePage)
      .then(_.delay(done, taskTests.delay)).catch(done)

  it 'should format the details page using markdown (for now)', (done) ->
    homeworkTaskId = 5
    TaskActions.loaded(homework_model, homeworkTaskId)
    targetStepIndex = 1

    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{homeworkTaskId}", homeworkTaskId)
      .then(taskActions.clickDetails)
      .then(taskChecks.checkIsPopoverOpen)
      .then(_.delay(done, taskTests.delay)).catch(done)
