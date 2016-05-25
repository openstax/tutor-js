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
    css: '.review-link a'
  periodTab:
    css: '.nav-tabs li:nth-child(2)'
  displayAs:
    css: '.filter-item:nth-child(1) .filter-group .btn:nth-child(2)'
  scoreCell:
    css: '.scores-cell a.score'
  hoverCCTooltip:
    css: '.scores-cell .worked .trigger-wrap'
  ccTooltip:
    css: '.scores-scores-tooltip-completed-info'
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
  noAssignmentNotice:
    css: '.course-scores-notice'
  scoresTable:
    css: '.course-scores-container .fixedDataTableLayout_main'
  shadow:
    css: '.public_fixedDataTable_bottomShadow'
  taskResultByRow: (rowNumber) ->
    rowSelector = if rowNumber? then ":nth-of-type(#{rowNumber})" else ''

    css: ".fixedDataTableRowLayout_rowWrapper#{rowSelector} .scores-cell .score a"


class Scores extends TestHelper
  constructor: (testContext, testElementLocator) ->

    testElementLocator ?=
      css: '.course-scores-container'

    super(testContext, testElementLocator, COMMON_ELEMENTS)
    @setCommonHelper('periodReviewTab', new PeriodReviewTab(@test))

  waitUntilLoaded: =>
    super()
    @disableShadow()

  disableShadow: =>
    # The facebook table has some "fancy" elements that don't move when the table
    # scrolls vertically. Unfortunately, they cover the links.
    # There is a UI "border shadow" element that ends up going right
    # through the middle of a link. So, just hide the element
    @el.shadow().isDisplayed().then (isDisplayed) =>
      if isDisplayed
        @test.driver.executeScript ->
          hider = document.createElement('style')
          hider.textContent = '.public_fixedDataTable_bottomShadow { display: none; }'
          document.head.appendChild(hider)

  goToPeriodWithAssignments: =>
    @el.periodTab().forEach (periodTab) =>
      @el.noAssignmentNotice().isDisplayed().then (hasNoAssignments) =>
        if hasNoAssignments
          periodTab.click()
          @waitUntilLoaded()

  goToPeriodWithWorkedAssignments: (rowNumber) =>
    @el.periodTab().forEach (periodTab) =>
      @el.taskResultByRow(rowNumber).isDisplayed().then (hasWorkedTask) =>
        unless hasWorkedTask
          periodTab.click()
          @waitUntilLoaded()

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
