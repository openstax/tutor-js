fs = require 'fs'
selenium = require 'selenium-webdriver'
{TestHelper} = require './test-element'
{PeriodReviewTab} = require './items'
Timeout = require '../timeout'

COMMON_ELEMENTS =
  nameHeaderSort:
    css: '.header-cell.is-ascending'
  dataHeaderSort:
    css: '.header-cell'
  generateExport:
    css: '.export-button button'
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
    @el.ccScoresLink().click()
    @waitUntilLoaded()

  getExportDownloadPath: =>
    # need to wait for the hidden iframe with the expected [src]
    # before checking for file
    @test.utils.wait.forHidden(@el.doneGenerating().getLocator()).getAttribute("src").then (src) =>
      file = src.split('/').pop()
      path = "#{@test.downloadDirectory}/#{file}"

      filePath = if fs.existsSync(path) then path else null
      fs.unlink(filePath) if filePath

      filePath

  hoverCCTooltip: =>
    @el.hoverCCTooltip().findElement().then (e) =>
      @test.driver.actions().mouseMove(e).perform()

  getCCTooltip: =>
    @hoverCCTooltip()
    @el.ccTooltip().get()




module.exports = Scores
