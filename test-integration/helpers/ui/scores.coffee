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
  hoverCCTooltip:
    css: '.cc-cell .worked .trigger-wrap'
  ccTooltip:
    css: '.cc-scores-tooltip-completed-info'
  averageLabel:
    css: '.average-label span:last-child'
  exportUrl:
    css: '#downloadExport'
  doneGenerating:
    css: "#downloadExport[src$='.xlsx']"
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
    @test.utils.wait.until 'export url is set', =>
      @test.driver.isElementPresent(COMMON_ELEMENTS.doneGenerating)

  downloadExport: =>
    if @doneGenerating()
      @el.exportUrl.findElement().getAttribute("src").then (src) =>
        @test.driver.navigate().to(src)

  tooltipVisible: =>
    @test.utils.wait.until 'hover over cc info tooltip', =>
      @test.driver.isElementPresent(COMMON_ELEMENTS.ccTooltip)

  hoverCCTooltip: =>
    @el.hoverCCTooltip.findElement().then (e) =>
      @test.driver.actions().mouseMove(e).perform()
      if @tooltipVisible()
        @el.ccTooltip.findElement().getText().then (txt) ->
          expect(txt).to.contain('Correct Attempted Total possible')






module.exports = Scores
