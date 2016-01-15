{describe, CourseSelect} = require './helpers'
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

  goToScores: ->
    if @courseTitle is 'CC'
      @test.waitClick(css: '.detailed-scores')
    else
      @test.waitClick(css: '.calendar-actions a:nth-child(3)')
    @test.sleep(1000)

  findMainElements: (elements) ->
    for element in elements
      e = @test.driver.findElement(css: element)
      e.getAttribute('class').then (element) ->
        console.log "found element: #{element}"
      e.isDisplayed().then (element) ->
        if not element
          throw Error('element is not visible')

  clickNameHeaderSort: ->
    @test.driver.findElement(css: '.header-cell.is-ascending').click().then ->
      console.log 'clicked name header sort'

  clickDataHeaderSort: ->
    @test.driver.findElement(css: '.header-cell').click().then ->
      console.log 'clicked data header sort'


module.exports = StudentScores



describe 'Student Scores', ->

  @it 'loads HS scores table', ->

    @scores = new StudentScores(@, TEACHER_USERNAME, 'PHYSICS')
    @scores.goToScores()
    @scores.findMainElements(MAIN_ELEMENTS)
    @scores.clickNameHeaderSort()
    @scores.clickDataHeaderSort()

  
  @it 'loads CC scores table', ->

    @scores = new StudentScores(@, TEACHER_USERNAME, 'CC')
    @scores.goToScores()
    @scores.findMainElements(MAIN_ELEMENTS)
    @scores.clickNameHeaderSort()
    @scores.clickDataHeaderSort()


