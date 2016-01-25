selenium = require 'selenium-webdriver'
{expect} = require 'chai'

{TestHelper} = require './test-element'

COMMON_ELEMENTS =
  forecastLink:
    locator:
      linkText: 'Performance Forecast'
  addToggle:
    locator:
      css: '.add-assignment .dropdown-toggle'
  addReadingButton:
    locator:
      linkText: 'Add Reading'
  addHomeworkButton:
    locator:
      linkText: 'Add Homework'
  addExternalButton:
    locator:
      linkText: 'Add External Assignment'


COMMON_POPUP_ELEMENTS =
  closeButton:
    locator:
      css: '.plan-modal .close'
  editLink:
    locator:
      linkText: 'Edit Assignment'
  reviewLink:
    locator:
      linkText: 'Review Metrics'

class PlanPopupHelper extends  TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?= '.plan-modal .panel.panel-default'
    super(test, testElementLocator, COMMON_POPUP_ELEMENTS)

  close: =>
    @getCloseButton().click()
    @test.sleep(2000)

  goEdit: =>
    @getEditLink().click()

  goReview: =>
    @getReviewLink().click()

class CalendarHelper extends TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?= '.calendar-container'
    super(test, testElementLocator, COMMON_ELEMENTS, loadingLocator: '.calendar-loading')
    @setCommonHelper('planPopup', new PlanPopupHelper(@test))

  createNew: (type) =>
    @waitUntilLoaded()

    @getAddToggle().click()

    switch type
      when 'READING' then @getAddReadingButton().click()
      when 'HOMEWORK' then @getAddHomeworkButton().click()
      when 'EXTERNAL' then @getAddExternalButton().click()
      else expect(false, 'Invalid assignment type').to.be.true

  goPerformanceForecast: =>
    @getForecastLink().click()

  goOpen: (title) =>
    # wait until the calendar is open
    @waitUntilLoaded()
    # TODO: Make this a `data-title` attribute
    # HACK: Might need to scroll the item to click on into view
    el = @test.waitAnd(css: "[data-title='#{title}']")
    @test.scrollTo(el)
    el.click()
    @test.scrollTop()


# Make sure the current screen is the calendar
verify = (test, ms) ->
  # wait until the calendar is open
  test.waitAnd(css: '.calendar-container:not(.calendar-loading)', ms)


# type: 'READING', 'HOMEWORK', 'EXTERNAL'
createNew = (test, type) ->
  verify(test)

  # Click "Add Assignment"
  test.waitClick(css: '.add-assignment .dropdown-toggle')

  # Go to the bio dashboard
  switch type
    when 'READING' then test.waitClick(linkText: 'Add Reading')
    when 'HOMEWORK' then test.waitClick(linkText: 'Add Homework')
    when 'EXTERNAL' then test.waitClick(linkText: 'Add External Assignment')
    else expect(false, 'Invalid assignment type').to.be.true

goOpen = (test, title) ->
  # wait until the calendar is open
  verify(test)
  # TODO: Make this a `data-title` attribute
  # HACK: Might need to scroll the item to click on into view
  el = test.waitAnd(css: "[data-title='#{title}']")
  test.scrollTo(el)
  el.click()
  test.scrollTop()

goPerformanceForecast = (test) ->
  test.waitClick(linkText: 'Performance Forecast')

Popup =
  verify: (test) ->
    # wait until the calendar is open
    test.waitAnd(css: '.plan-modal .panel.panel-default')
  close: (test) ->
    test.waitClick(css: '.plan-modal .close')
    test.sleep(2000) # Wait for the modal to animate and disappear

  goEdit: (test) ->
    test.waitClick(linkText: 'Edit Assignment')

  goReview: (test) ->
    # BUG: Should rely on button classes
    test.waitClick(linkText: 'Review Metrics')
    # Verify the review page loaded
    test.waitAnd(css: '.task-teacher-review .task-breadcrumbs')


module.exports = {verify, createNew, goOpen, goPerformanceForecast, Popup}
