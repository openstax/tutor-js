selenium = require 'selenium-webdriver'
_ = require 'underscore'

{TestHelper} = require './test-element'

COMMON_ELEMENTS =
  continueButton:
    locator:
      css: '.continue'
  enabledContinueButton:
    locator:
      css: '.continue:not([disabled])'
  stepCrumbs:
    locator:
      css: '.task-breadcrumbs-step'
    isSingle: false

# all convenience functions for helping with task tests will be seen here.
class TaskHelper extends TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?= '.task-reading, .task-homework'
    super(test, testElementLocator, COMMON_ELEMENTS)

  continue: =>
    continueButton = @getContinueButton()
    @test.driver.wait selenium.until.elementIsEnabled(continueButton)
    continueButton.click()

module.exports = {TaskHelper}
