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
  canReview:
    css: '[data-has-review]'
    attr: 'data-has-review'
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
  title:
    css: '.modal-title'

class Popup extends TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?=
      css: '.plan-modal .panel.panel-default'
    super(test, testElementLocator, COMMON_POPUP_ELEMENTS)
    @setCommonHelper('periodReviewTab', new PeriodReviewTab(@test))

  close: =>
    @el.closeButton.click()
    # waits until the locator element is not present
    @test.driver.wait =>
      @isPresent().then (isPresent) ->
        not isPresent

  goToEdit: =>
    @el.editLink.waitClick()
    @test.utils.wait.until 'modal is closed', =>
      @el.modal.isPresent().then (isPresent) ->
        !isPresent

  canGoToReviewMetrics: =>
    @el.reviewLink.isPresent()

  goReview: =>
    @el.reviewLink.waitClick()

  getTitle: =>
    @el.title.findElement().getText()

  # selectPeriodByIndex(num)
  # selectPeriodByTitle(title)

class Calendar extends TestHelper
  @Popup: Popup
  @verify: (test) ->
    (new Calendar(test)).waitUntilLoaded()

  constructor: (test, testElementLocator) ->
    testElementLocator ?=
      css: '.calendar-container'
    calendarOptions =
      loadingLocator:
        css: '.calendar-loading'

    super(test, testElementLocator, COMMON_ELEMENTS, calendarOptions)

  createNew: (type) =>
    @waitUntilLoaded()

    @el.addToggle.click()

    switch type
      when 'READING' then @el.addReadingButton.click()
      when 'HOMEWORK' then @el.addHomeworkButton.click()
      when 'EXTERNAL' then @el.addExternalButton.click()
      else expect(false, 'Invalid assignment type').to.be.true

  goToForecast: =>
    @el.forecastLink.click()

  goToScores: =>
    @el.studentScoresLink.click()

  goToOpenByTitle: (title) =>
    # wait until the calendar is open
    @waitUntilLoaded()
    # TODO: Make this a `data-title` attribute
    # HACK: Might need to scroll the item to click on into view
    el = @el.planByTitle(title).get()
    @test.utils.windowPosition.scrollTo(el)
    @el.planByTitle(title).click()
    @waitUntilLoaded() # Wait until either the popup opens or the Reading Builder opens (depending on the state of the thing clicked)

  waitUntilPublishingFinishedByTitle: (title) =>
    @test.utils.verbose("Waiting to see if plan is published #{title}")
    @test.utils.wait.giveTime PUBLISHING_TIMEOUT, =>
      @test.driver.wait((=> @el.publishedPlanByTitle(title).isPresent()), PUBLISHING_TIMEOUT)

  canReviewPlan: (plan) =>
    @test.utils.dom._getParent(plan).getAttribute(@el.canReview.locator.attr)

  getPlanTitle: (plan) ->
    plan.getText()

  # goToBook()
  # goToAddByType(assignmentType)
  # goToAddByTypeFromNow(assignmentType, relativeDate)
  # goToPreviousMonth()
  # goToNextMonth()
  # goToEditByTitle(title)
  # goToReviewByTitle(title)

module.exports = Calendar
