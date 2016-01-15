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


describe 'Student Scores', ->

  @it 'loads HS scores table', ->
    @login(TEACHER_USERNAME)
    CourseSelect.goTo(@, 'PHYSICS')
    @waitClick(css: '.calendar-actions a:nth-child(3)')
    @sleep(1000)

    elements = MAIN_ELEMENTS

    for element in elements
      @driver.findElement(css: element).getAttribute('class').then (element) ->
        console.log "found element: #{element}"

    @driver.findElement(css: '.header-cell.is-ascending').click().then ->
      console.log 'clicked name header sort'

    @driver.findElement(css: '.header-cell').click().then ->
      console.log 'clicked data header sort'

  
  @it 'loads CC scores table', ->
    @login(TEACHER_USERNAME)
    CourseSelect.goTo(@, 'CC')
    @waitClick(css: '.detailed-scores')
    @sleep(1000)

    elements = MAIN_ELEMENTS

    for element in elements
      @driver.findElement(css: element).getAttribute('class').then (element) ->
        console.log "found element: #{element}"

    @driver.findElement(css: '.header-cell.is-ascending').click().then ->
      console.log 'clicked name header sort'

    @driver.findElement(css: '.header-cell').click().then ->
      console.log 'clicked data header sort'


