{describe, CourseSelect, Calendar, ReadingBuilder} = require '../helpers'
{expect} = require 'chai'
_ = require 'underscore'


class StudentDashboard

  constructor: (@test, @login, @courseTitle) ->
    @test.login(@login)
    CourseSelect.goToCourseByName(@test, @courseTitle)

  progressGuideEl: ->
    @test.driver.wait =>
      @test.driver.isElementPresent(css: '.loadable.is-loading').then (isPresent) -> not isPresent
    @test.driver.findElement(css: '.progress-guide')

module.exports = StudentDashboard


describe 'Student Dashboard', ->

  @beforeEach ->
    @dash = new StudentDashboard(@, 'student01', 'Biology I')


  @it 'Shows Performance Forecast', ->
    guide = @dash.progressGuideEl()
    titles = guide.findElements(css: '.section > .title')
    #console.log titles
    guide.getText().then (txt) ->
      console.log "TEXT", txt
    # titles = _.map titles, (el) -> el #.getText()
    # console.log titles
    expect(guide).not.to.be.null
