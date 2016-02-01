selenium = require 'selenium-webdriver'
{expect} = require 'chai'
{TestHelper} = require './test-element'
{PeriodReviewTab} = require './items'

COMMON_ELEMENTS =
  forecastLink:
    linkText: 'Performance Forecast'
  studentScoresLink:
    linkText: 'Student Scores'
  addToggle:
    css: '.add-assignment .dropdown-toggle'
  addReadingButton:
    linkText: 'Add Reading'
  addHomeworkButton:
    linkText: 'Add Homework'
  addExternalButton:
    linkText: 'Add External Assignment'
  publishedPlan:
    css: '.plan.is-published label:not(.continued)'
  draftPlan:
    css: '.plan:not(.is-published) label:not(.continued)'
    ignoreLengthChange: true
  openPlan:
    css: '.plan.is-open.is-published label:not(.continued)'
  unopenPlan:
    css: '.plan.is-published:not(.is-open) label:not(.continued)'
    ignoreLengthChange: true
  planByTitle: (title) ->
    css: ".plan label[data-title='#{title}']"

COMMON_POPUP_ELEMENTS =
  closeButton:
    css: '.plan-modal .close'
  editLink:
    linkText: 'Edit Assignment'
  reviewLink:
    linkText: 'Review Metrics'

class PlanPopupHelper extends  TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?=
      css: '.plan-modal .panel.panel-default'
    super(test, testElementLocator, COMMON_POPUP_ELEMENTS, defaultWaitTime: 3000)
    @setCommonHelper('periodReviewTab', new PeriodReviewTab(@test))

  close: =>
    @test.utils.windowPosition.scrollTop()
    @el.closeButton.get().click()
    # waits until the locator element is not present
    @test.driver.wait =>
      @isPresent().then (isPresent) ->
        not isPresent

  goEdit: =>
    @el.editLink.get().click()

  goReview: =>
    @el.reviewLink.get().click()


class CalendarHelper extends TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?=
      css: '.calendar-container'
    calendarOptions =
      loadingLocator:
        css: '.calendar-loading'
      defaultWaitTime: 3000

    super(test, testElementLocator, COMMON_ELEMENTS, calendarOptions)
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
    @test.utils.windowPosition.scrollTop()
    @el.forecastLink.get().click()

  goStudentScores: =>
    @test.utils.windowPosition.scrollTop()
    @el.studentScoresLink.get().click()

  goOpen: (title) =>
    # wait until the calendar is open
    @waitUntilLoaded()
    # TODO: Make this a `data-title` attribute
    # HACK: Might need to scroll the item to click on into view
    el = @el.planByTitle.get(title)
    @test.utils.windowPosition.scrollTo(el)
    el.click()
    @test.utils.windowPosition.scrollTop()


verify = (test, ms) ->
  new CalendarHelper(test).waitUntilLoaded(ms)

module.exports = {CalendarHelper, verify}
