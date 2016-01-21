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
    @goToScores()

  goToScores: ->
    if @courseTitle is 'Concept Coach'
      CourseSelect.goToCourseByName(@test, @courseTitle)
      @test.waitClick(css: '.detailed-scores')
    else
      CourseSelect.goTo(@test, @courseTitle)
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

  clickElement: (className, message) ->
    @test.driver.findElement(css: className).click().then ->
      console.log "clicked: #{message}"

  nameHeaderSort: ->
    @clickElement('.header-cell.is-ascending','name header sort')

  dataHeaderSort: ->
    @clickElement('.header-cell','data header sort')

  changePeriod: ->
    nextPeriod = @test.driver.findElement(css: '.nav-tabs li:nth-child(2)')
    if nextPeriod?
      nextPeriod.click().then ->
        console.log 'changed period/section'

  generateExport: ->
    @clickElement('.export-button','generate export')

  doneGenerating: ->
    @test.driver.wait =>
      @test.driver.isElementPresent(css: '.export-button-buttons a')

  downloadExport: ->
    if @doneGenerating()
      @clickElement('.export-button-buttons a','download')

  goBack: ->
    @test.driver.navigate().back()

  hsNameLink: ->
    @clickElement('.name-cell a.student-name','student name link')
    @goBack()

  hsReviewLink: ->
    @clickElement('a.review-plan','review plan link')
    @goBack()

  hsHomeworkLink: ->
    @clickElement('a.scores-cell[data-assignment-type="homework"]','homework link')
    @goBack()

  hsReadingLink: ->
    @clickElement('a.scores-cell[data-assignment-type="reading"]','reading link')
    @goBack()

  ccScoreLink: ->
    @clickElement('.cc-cell a.score','cc score link')
    @goBack()

module.exports = StudentScores



describe 'Student Scores', ->

  @it 'HS Scores workflow', ->

    scores = new StudentScores(@, TEACHER_USERNAME, 'PHYSICS')

    @screenshot("test-hs-scores-loaded")

    scores.findMainElements(MAIN_ELEMENTS)
    scores.nameHeaderSort()
    scores.dataHeaderSort()
    scores.changePeriod()
    scores.generateExport()
    scores.downloadExport()
    scores.hsNameLink()
    scores.hsReviewLink()
    scores.hsHomeworkLink()
    scores.hsReadingLink()

  
  @it 'CC Scores workflow', ->

    scores = new StudentScores(@, TEACHER_USERNAME, 'Concept Coach')

    @screenshot("test-cc-scores-loaded")

    scores.findMainElements(MAIN_ELEMENTS)
    scores.nameHeaderSort()
    scores.dataHeaderSort()
    scores.changePeriod()
    scores.generateExport()
    scores.downloadExport()
    scores.ccScoreLink()

