selenium = require 'selenium-webdriver'
_ = require 'underscore'

{TestHelper} = require './test-element'

class TaskHelper extends TestHelper
  constructor: (test, testElementLocator) ->
    commonElements =
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

    testElementLocator ?= '.task-reading, .task-homework'
    super(test, testElementLocator, commonElements)

  continue: =>
    continueButton = @continueButton.get()
    @test.driver.wait selenium.until.elementIsEnabled(continueButton)
    continueButton.click()

module.exports = {TaskHelper}
