selenium = require 'selenium-webdriver'
_ = require 'underscore'

{TestHelper} = require './test-element'

COMMON_ELEMENTS =
  continueButton:
    css: '.continue'
  enabledContinueButton:
    css: '.continue:not([disabled])'
  disabledContinueButton:
    css: '.continue[disabled]'
  stepCrumbs:
    css: '.task-breadcrumbs-step'
  currentBreadcrumbStep:
    css: '.openstax-breadcrumbs-step.current.active'
  helpLink:
    css: '.task-help-links a'
  taskTypeIsReading:
    css: '.pinned-container.task.task-reading'
  readingNextArrow:
    css: '.pinned-container .arrow.right'
  taskStepIsExercise:
    css: '.openstax-exercise-card'

  # taskTypeIsExternal:
  #   css: '.pinned-container.task.task-external'
  # taskTypeIsHomework:
  #   css: '.pinned-container.task.task-homework'
  # taskTypeIsEvent:
  #   css: '.pinned-container.task.task-event'

# all convenience functions for helping with task tests will be seen here.
class Task extends TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?=
      css: '.task-reading, .task-homework'
    super(test, testElementLocator, COMMON_ELEMENTS)

  # isExternal: => @el.taskTypeIsExternal().isPresent()
  # isHomework: => @el.taskTypeIsHomework().isPresent()
  isReading:  => @el.taskTypeIsReading().isPresent()
  stepIsExercise: =>
    @el.taskStepIsExercise().isPresent()
  # isEvent:    => @el.taskTypeIsEvent().isPresent()

  canContinue: => @el.enabledContinueButton().isPresent()

  getCurrentStep: =>
    @isReading().then (isPresent) =>
      if (isPresent)
        @el.readingNextArrow().get().getAttribute('data-step')
      else
        @el.currentBreadcrumbStep().get().getAttribute('data-reactid')


  continue: =>
    @test.utils.windowPosition.scrollTo(@el.continueButton().get()) # HACK For some reason we have to scroll down to the continue button

    # Get the current step, click continue, and wait until the current step changes
    @getCurrentStep().then (oldStepId) =>
      @continueTask()

      @test.utils.wait.until "Waiting for current step: #{oldStepId} to change", =>
        @getCurrentStep().then (newStepId) =>
          newStepId isnt oldStepId

      @test.utils.wait.until 'Waiting for continue button to be enabled again', =>
        selenium.until.elementIsEnabled(@el.continueButton().get())

  continueTask: =>
    @isReading().then (isPresent) =>
      if isPresent
        @el.readingNextArrow().waitClick()
      else
        @el.enabledContinueButton().waitClick()

  goToHelpLink: =>
    @el.helpLink().waitClick()

module.exports = Task
