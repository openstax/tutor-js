{describe, CourseSelect, screenshot} = require './helpers'
selenium = require 'selenium-webdriver'
{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'

MAIN_ELEMENTS = [
  '.scores-report',
  '.course-scores-wrap',
  '.nav-tabs',
  '.export-button',
  '.course-scores-title',
  '.course-scores-container'
]


class StudentScores

  constructor: (@test, @login, @courseTitle) ->
    @test.login(@login)
    CourseSelect.goTo(@test, @courseTitle)
    @goToScores()

  goToScores: ->
    if @courseTitle is 'CC'
      @test.waitClick(css: '.detailed-scores')
    else
      @test.waitClick(css: '.calendar-actions a:nth-child(3)')
    @test.sleep(1500)

  findMainElements: (elements) ->
    for element in elements
      e = @test.driver.findElement(css: element)
      e.getAttribute('class').then (element) ->
        console.log "found element: #{element}"
      e.isDisplayed().then (element) ->
        if not element
          throw Error('element is not visible')

  nameHeaderSort: ->
    @test.driver.findElement(css: '.header-cell.is-ascending').click().then ->
      console.log 'clicked name header sort'

  dataHeaderSort: ->
    @test.driver.findElement(css: '.header-cell').click().then ->
      console.log 'clicked data header sort'

  changePeriod: ->
    nextPeriod = @test.driver.findElement(css: '.nav-tabs li:nth-child(2)')
    if nextPeriod?
      nextPeriod.click().then ->
        console.log 'changed period/section'

  generateExport: ->
    @test.driver.findElement(css: '.export-button').click().then ->
      console.log 'generate export'

  doneGenerating: ->
    @test.driver.wait =>
      @test.driver.isElementPresent(css: '.export-button-buttons a')

  downloadExport: ->
    if @doneGenerating()
      @test.driver.findElement(css: '.export-button-buttons a').click().then ->
        console.log 'clicked download'

module.exports = StudentScores



describe 'Student Scores', ->

  @it 'HS Scores workflow', ->

    @scores = new StudentScores(@, TEACHER_USERNAME, 'PHYSICS')

    @screenshot("test-hs-scores-loaded")

    @scores.findMainElements(MAIN_ELEMENTS)
    @scores.nameHeaderSort()
    @scores.dataHeaderSort()
    @scores.changePeriod()
    @scores.generateExport()
    @scores.downloadExport()

  
  @it 'CC Scores workflow', ->

    @scores = new StudentScores(@, TEACHER_USERNAME, 'CC')

    @screenshot("test-cc-scores-loaded")

    @scores.findMainElements(MAIN_ELEMENTS)
    @scores.nameHeaderSort()
    @scores.dataHeaderSort()
    @scores.changePeriod()
    @scores.generateExport()
    @scores.downloadExport()

