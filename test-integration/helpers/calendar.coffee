selenium = require 'selenium-webdriver'
{expect} = require 'chai'
{TestHelper} = require './test-element'
{PeriodReviewTab} = require './items'

PUBLISHING_TIMEOUT = 60 * 1000 # Wait up to a minute for publishing to complete.

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
  publishedPlanByTitle: (title) ->
    css: ".plan.is-published label[data-title='#{title}']"


COMMON_POPUP_ELEMENTS =
  closeButton:
    css: '.plan-modal .close'
  editLink:
    # linkText: 'Edit Assignment'
    css: '.plan-modal.in .-edit-assignment'
  reviewLink:
    linkText: 'Review Metrics'
  modal:
    css: '.plan-modal.active'

class PlanPopupHelper extends TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?=
      css: '.plan-modal .panel.panel-default'
    super(test, testElementLocator, COMMON_POPUP_ELEMENTS)
    @setCommonHelper('periodReviewTab', new PeriodReviewTab(@test))

  close: =>
    @test.utils.windowPosition.scrollTop()
    @el.closeButton.click()
    # waits until the locator element is not present
    @test.driver.wait =>
      @isPresent().then (isPresent) ->
        not isPresent

  goEdit: =>
    @el.editLink.waitClick()
    @test.utils.wait.until 'modal is closed', =>
      @el.modal.isPresent().then (isPresent) ->
        !isPresent

  goReview: =>
    @el.reviewLink.waitClick()


class Calendar extends TestHelper
  @PlanPopupHelper: PlanPopupHelper
  @verify: (test) ->
    (new Calendar(test)).waitUntilLoaded()

  constructor: (test, testElementLocator) ->
    testElementLocator ?=
      css: '.calendar-container'
    calendarOptions =
      loadingLocator:
        css: '.calendar-loading'

    super(test, testElementLocator, COMMON_ELEMENTS, calendarOptions)
    @setCommonHelper('planPopup', new PlanPopupHelper(@test))

  createNew: (type) =>
    @waitUntilLoaded()

    @el.addToggle.click()

    switch type
      when 'READING' then @el.addReadingButton.click()
      when 'HOMEWORK' then @el.addHomeworkButton.click()
      when 'EXTERNAL' then @el.addExternalButton.click()
      else expect(false, 'Invalid assignment type').to.be.true

  goPerformanceForecast: =>
    @test.utils.windowPosition.scrollTop()
    @el.forecastLink.click()

  goStudentScores: =>
    @test.utils.windowPosition.scrollTop()
    @el.studentScoresLink.click()

  goOpen: (title) =>
    # wait until the calendar is open
    @waitUntilLoaded()
    # TODO: Make this a `data-title` attribute
    # HACK: Might need to scroll the item to click on into view
    el = @el.planByTitle(title).get()
    @test.utils.windowPosition.scrollTo(el)
    @el.planByTitle(title).click()
    @test.utils.windowPosition.scrollTop()
    @waitUntilLoaded() # Wait until either the popup opens or the Reading Builder opens (depending on the state of the thing clicked)

  waitUntilPublishingFinishedByTitle: (title) =>
    @test.utils.verbose("Waiting to see if plan is published #{title}")
    @test.utils.wait.giveTime PUBLISHING_TIMEOUT, =>
      @test.driver.wait((=> @el.publishedPlanByTitle(title).isPresent()), PUBLISHING_TIMEOUT)

module.exports = Calendar
