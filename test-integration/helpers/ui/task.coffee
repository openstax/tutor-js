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

  # taskTypeIsExternal:
  #   css: '.pinned-container.task.task-external'
  # taskTypeIsHomework:
  #   css: '.pinned-container.task.task-homework'
  # taskTypeIsReading:
  #   css: '.pinned-container.task.task-reading'
  # taskTypeIsEvent:
  #   css: '.pinned-container.task.task-event'

# all convenience functions for helping with task tests will be seen here.
class Task extends TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?= '.task-reading, .task-homework'
    super(test, testElementLocator, COMMON_ELEMENTS)

  # isExternal: => @el.taskTypeIsExternal().isPresent()
  # isHomework: => @el.taskTypeIsHomework().isPresent()
  # isReading:  => @el.taskTypeIsReading().isPresent()
  # isEvent:    => @el.taskTypeIsEvent().isPresent()

  canContinue: => @el.enabledContinueButton().isPresent()

  continue: =>
    @test.utils.windowPosition.scrollTo(@el.continueButton().get()) # HACK For some reason we have to scroll down to the continue button

    # Get the current step, click continue, and wait until the current step changes
    @el.currentBreadcrumbStep().get().getAttribute('data-reactid').then (oldStepId) =>
      @el.enabledContinueButton().waitClick()

      @test.utils.wait.until 'Waiting for current step to change', =>
        @el.currentBreadcrumbStep().get().getAttribute('data-reactid').then (newStepId) =>
          newStepId isnt oldStepId

      @test.utils.wait.until 'Waiting for continue button to be enabled again', =>
        selenium.until.elementIsEnabled(@el.continueButton().get())

module.exports = Task
