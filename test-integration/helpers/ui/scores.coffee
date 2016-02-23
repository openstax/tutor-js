fs = require 'fs'
selenium = require 'selenium-webdriver'
{expect} = require 'chai'
{TestHelper} = require './test-element'
{PeriodReviewTab} = require './items'


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

  doneGenerating: =>
    @test.utils.wait.until 'export url is set', =>
      @test.driver.isElementPresent(COMMON_ELEMENTS.doneGenerating)

  downloadExport: =>
    if @doneGenerating()
      @el.exportUrl().findElement().getAttribute("src").then (src) =>
        file = src.split('/').pop()
        path = "#{@test.downloadDirectory}/#{file}"
        if fs.existsSync(path)
          fs.unlink(path)
        else
          throw new Error('BUG: Exported file not found!')






module.exports = Scores
