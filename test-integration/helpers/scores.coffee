selenium = require 'selenium-webdriver'
{expect} = require 'chai'
{TestHelper} = require './test-element'
{PeriodReviewTab} = require './items'


COMMON_ELEMENTS =
  ccScoresLink:
    linkText: 'Student Scores'
  ccScoresLink:
    linkText: 'View Detailed Scores'
  nameHeaderSort:
    css: '.header-cell.is-ascending'
  dataHeaderSort:
    css: '.header-cell'
  generateExport:
    css: '.export-button'
  downloadExport:
    css: '.export-button-buttons a'
  hsNameLink:
    css: '.name-cell a.student-name'
  hsReviewLink:
    css: 'a.review-plan'
  periodTab:
    css: '.nav-tabs li:nth-child(2)'
  displayAs:
    css: '.filter-item:nth-child(1) .filter-group .btn:nth-child(2)'
  scoreCell:
    css: '.cc-cell a.score'
  averageLabel:
    css: '.average-label span:last-child'
  assignmentByType: (type) ->
    css: "a.scores-cell[data-assignment-type='#{type}']"


class Scores extends TestHelper
  constructor: (testContext, testElementLocator) ->

    testElementLocator ?=
      css: '.course-scores-container'

    super(testContext, testElementLocator, COMMON_ELEMENTS)
    @setCommonHelper('periodReviewTab', new PeriodReviewTab(@test))

  # this could be moved to cc-dashboard helper at some point
  goCCScores: =>
    @el.ccScoresLink.click()
    @waitUntilLoaded()

  doneGenerating: =>
    #@test.driver.wait =>
      #@test.driver.isElementPresent(css: @el.downloadExport)

    @utils.isPresent(@el.downloadExport)


  # selectDisplayAsNumber()
  # selectDisplayAsPercent()
  # selectBasedOnPossible()
  # selectBasedOnAttempted()
  # selectPeriodByIndex(num)
  # selectPeriodByTitle(title)
  # sortName()
  # goToAssignmentByIndexes(row, column)
  # downloadExport()

  # # CC Commands:
  # sortAssignmentScoreByIndex(index)
  # sortAssignmentCompletedByIndex(index)
  # sortAssignmentScoreByTitle(title)
  #
  # # HS Commands:
  # goToForecastByName(studentName)
  # goToReviewByIndex(index)
  # goToReviewByTitle(title)

module.exports = Scores
