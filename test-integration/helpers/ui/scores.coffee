fs = require 'fs'
path = require 'path'
_ = require 'underscore'
selenium = require 'selenium-webdriver'
io = require 'selenium-webdriver/io'

{TestHelper} = require './test-element'
{PeriodReviewTab} = require './items'

FAILED_EXPORT_SELECTOR = '.export-button-buttons .refresh-button'
SUCCEEDED_EXPORT_SELECTOR = '#downloadExport[src$=".xlsx"]'

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
  exportFailed:
    css: FAILED_EXPORT_SELECTOR
  exportSucceeded:
    css: SUCCEEDED_EXPORT_SELECTOR
  doneGenerating:
    css: "#{FAILED_EXPORT_SELECTOR}, #{SUCCEEDED_EXPORT_SELECTOR}"
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

  waitUntilDoneExporting: =>
    @test.utils.wait.forHidden(@el.doneGenerating().getLocator())

  isExportSucceeded: =>
    @el.exportSucceeded().isPresent()

  isExportDownloaded: =>
    @el.exportSucceeded().findElement().getAttribute('src').then (src) =>
      file = path.basename(src)
      # TODO get actual filename to test for full file path
      io.exists(@test.downloadDirectory)

    .then (isExportDownloaded) =>
      @cleanUpDownloadedExports() if isExportDownloaded
      isExportDownloaded

  cleanUpDownloadedExports: =>
    fs.readdir @test.downloadDirectory, (err, files) =>
      _.each(files, (file) =>
        fullPath = "#{@test.downloadDirectory}/#{file}"
        @test.utils.verbose("Removing #{fullPath}.")
        io.unlink(fullPath)
      )

  hoverCCTooltip: =>
    @el.hoverCCTooltip().findElement().then (e) =>
      @test.driver.actions().mouseMove(e).perform()

  getCCTooltip: =>
    @hoverCCTooltip()
    @el.ccTooltip().get()




module.exports = Scores
