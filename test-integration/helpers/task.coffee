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

# all convenience functions for helping with task tests will be seen here.
class TaskHelper extends TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?= '.task-reading, .task-homework'
    super(test, testElementLocator, COMMON_ELEMENTS)

  continue: =>
    @test.utils.windowPosition.scrollTo(@el.continueButton.get()) # HACK For some reason we have to scroll down to the continue button

    # Get the current step, click continue, and wait until the current step changes
    @el.currentBreadcrumbStep.get().getAttribute('data-reactid').then (oldStepId) =>
      @el.enabledContinueButton.waitClick()
      @test.utils.verboseWrap 'Waiting for current step to change', =>
        @test.driver.wait =>
          @el.currentBreadcrumbStep.get().getAttribute('data-reactid').then (newStepId) =>
            newStepId isnt oldStepId
      @test.utils.verboseWrap 'Waiting for continue button to be enabled again', =>
        @test.driver.wait => selenium.until.elementIsEnabled(@el.continueButton.get())

module.exports = {TaskHelper}
