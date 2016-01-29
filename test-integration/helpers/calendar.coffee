selenium = require 'selenium-webdriver'
{expect} = require 'chai'
utils = require './utils'
{TestHelper} = require './test-element'
windowPosition = require './utils/window-position'

COMMON_ELEMENTS =
  forecastLink:
    linkText: 'Performance Forecast'
  addToggle:
    css: '.add-assignment .dropdown-toggle'
  addReadingButton:
    linkText: 'Add Reading'
  addHomeworkButton:
    linkText: 'Add Homework'
  addExternalButton:
    linkText: 'Add External Assignment'


COMMON_POPUP_ELEMENTS =
  closeButton:
    css: '.plan-modal .close'
  editLink:
    linkText: 'Edit Assignment'
  reviewLink:
    linkText: 'Review Metrics'

class PlanPopupHelper extends  TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?= '.plan-modal .panel.panel-default'
    super(test, testElementLocator, COMMON_POPUP_ELEMENTS)

  close: =>
    @el.closeButton.get().click()
    # waits until the locator element is not present
    @test.driver.wait =>
      @test.driver.isElementPresent(@locator).then (isPresent) -> isPresent

  goEdit: =>
    @el.editLink.get().click()

  goReview: =>
    @el.reviewLink.get().click()

class CalendarHelper extends TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?= '.calendar-container'
    super(test, testElementLocator, COMMON_ELEMENTS, loadingLocator: '.calendar-loading')
    @setCommonHelper('planPopup', new PlanPopupHelper(@test))

  createNew: (type) =>
    @waitUntilLoaded()

    @el.addToggle.get().click()

    switch type
      when 'READING' then @el.addReadingButton.get().click()
      when 'HOMEWORK' then @el.addHomeworkButton.get().click()
      when 'EXTERNAL' then @el.addExternalButton.get().click()
      else expect(false, 'Invalid assignment type').to.be.true

  goPerformanceForecast: =>
    @el.forecastLink().get().click()

  goOpen: (title) =>
    # wait until the calendar is open
    @waitUntilLoaded()
    # TODO: Make this a `data-title` attribute
    # HACK: Might need to scroll the item to click on into view
    el = @test.utils.wait.for(css: "[data-title='#{title}']")
    windowPosition(test).scrollTo(el)
    el.click()
    windowPosition(test).scrollTop()


# Make sure the current screen is the calendar
verify = (test, ms) ->
  # wait until the calendar is open
  test.utils.wait.for(css: '.calendar-container:not(.calendar-loading)', ms)


# type: 'READING', 'HOMEWORK', 'EXTERNAL'
createNew = (test, type) ->
  verify(test)

  # Click "Add Assignment"
  test.utils.wait.click(css: '.add-assignment .dropdown-toggle')

  # Go to the bio dashboard
  switch type
    when 'READING'  then test.utils.wait.click(linkText: 'Add Reading')
    when 'HOMEWORK' then test.utils.wait.click(linkText: 'Add Homework')
    when 'EXTERNAL' then test.utils.wait.click(linkText: 'Add External Assignment')
    else expect(false, 'Invalid assignment type').to.be.true

goOpen = (test, title) ->
  # wait until the calendar is open
  verify(test)
  # TODO: Make this a `data-title` attribute
  # HACK: Might need to scroll the item to click on into view
  el = test.utils.wait.for(css: "[data-title='#{title}']")
  test.utils.windowPosition.scrollTo(el)
  el.click()
  test.utils.windowPosition.scrollTop()

goPerformanceForecast = (test) ->
  test.utils.wait.click(linkText: 'Performance Forecast')

Popup =
  verify: (test) ->
    # wait until the calendar is open
    test.utils.wait.for(css: '.plan-modal .panel.panel-default')
  close: (test) ->
    test.utils.wait.click(css: '.plan-modal .close')
    test.sleep(2000) # Wait for the modal to animate and disappear

  goEdit: (test) ->
    test.utils.wait.click(linkText: 'Edit Assignment')

  goReview: (test) ->
    # BUG: Should rely on button classes
    test.utils.wait.click(linkText: 'Review Metrics')
    # Verify the review page loaded
    test.utils.wait.for(css: '.task-teacher-review .task-breadcrumbs')

module.exports = {verify, createNew, goOpen, goPerformanceForecast, Popup}
