selenium = require 'selenium-webdriver'
{expect} = require 'chai'
{TestHelper} = require './test-element'
{PeriodReviewTab} = require './items'

PUBLISHING_TIMEOUT = 2 * 60 * 1000 # Wait up to 2 minutes for publishing to complete.

COMMON_ELEMENTS =
  loadingState:
    css: '.calendar-loading'
  forecastLink:
    linkText: 'Performance Forecast'
  studentScoresLink:
    linkText: 'Student Scores'
  bookLink:
    linkText: 'Browse The Book'
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
  publishedHomework:
    css: '.plan.is-published label:not(.continued)[data-assignment-type=homework]'
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
  lmsLink:
    css: '.lms-info a'
  lmsPopover:
    css: '.sharable-link.popover'


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
    @el.closeButton().click()
    # waits until the locator element is not present
    @test.driver.wait =>
      @el.self().isPresent().then (isPresent) ->
        not isPresent

  goToEdit: =>
    @el.editLink().waitClick()
    @test.utils.wait.until 'modal is closed', =>
      @el.modal().isPresent().then (isPresent) ->
        !isPresent

  canGoToReviewMetrics: =>
    @el.reviewLink().isPresent()

  goReview: =>
    @el.reviewLink().waitClick()

  getTitle: =>
    @el.title().findElement().getText()

  # selectPeriodByIndex(num)
  # selectPeriodByTitle(title)

class Calendar extends TestHelper
  @Popup: Popup
  @verify: (test) ->
    (new Calendar(test)).waitUntilLoaded()

  constructor: (test, testElementLocator) ->
    testElementLocator ?=
      css: '.calendar-container'

    super(test, testElementLocator, COMMON_ELEMENTS)

  createNew: (type) =>
    @waitUntilLoaded()

    @el.addToggle().click()

    switch type
      when 'READING' then @el.addReadingButton().click()
      when 'HOMEWORK' then @el.addHomeworkButton().click()
      when 'EXTERNAL' then @el.addExternalButton().click()
      else expect(false, 'Invalid assignment type').to.be.true

  goToForecast: =>
    @el.forecastLink().click()

  goToScores: =>
    @el.studentScoresLink().click()

  goToOpenByTitle: (title) =>
    # wait until the calendar is open
    @waitUntilLoaded()
    plan = null
    # TODO: Make this a `data-title` attribute
    # HACK: Might need to scroll the item to click on into view
    @el.planByTitle(title).get().then (el) =>
      plan = el
      @doesPlanPopup(plan)
    .then (doesPopup) =>
      plan.click()
      # Wait until the popup opens if this plan should open a popup
      if doesPopup
        popup = new Popup(@test)
        popup.waitUntilLoaded()

  waitUntilPublishingFinishedByTitle: (title) =>
    @test.utils.verbose("Waiting to see if plan is published #{title}")
    @test.utils.wait.giveTime PUBLISHING_TIMEOUT, =>
      @test.driver.wait((=> @el.publishedPlanByTitle(title).isPresent()), PUBLISHING_TIMEOUT)

  doesPlanPopup: (plan) =>
    @test.utils.dom.getParentOfEl(plan).getTagName().then (tagName) ->
      tagName isnt 'a'

  canReviewPlan: (plan) =>
    @test.utils.dom.getParentOfEl(plan).getAttribute(@el.canReview().locator.attr)

  getPlanTitle: (plan) ->
    plan.getText()

  goToBook: ->
    @el.bookLink().click()

  getLmsPopover: =>
    @el.lmsLink().click()
    @el.lmsPopover().get()

  # goToAddByType(assignmentType)
  # goToAddByTypeFromNow(assignmentType, relativeDate)
  # goToPreviousMonth()
  # goToNextMonth()
  # goToEditByTitle(title)
  # goToReviewByTitle(title)

module.exports = Calendar
