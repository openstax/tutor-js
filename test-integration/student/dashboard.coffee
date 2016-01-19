selenium = require 'selenium-webdriver'
{describe, CourseSelect, Calendar, ReadingBuilder} = require '../helpers'
{expect} = require 'chai'
_ = require 'underscore'

class PanelElement

  constructor: (test, el) ->
    @_test = test
    if _.isString(el)
      el = @test.driver.findElement(css: el)
    @_element = el

Object.defineProperties PanelElement.prototype,
  valid:
    get: -> !!@_element
  element:
    get: -> @_element
  test:
    get: -> @_test

class TaskStep extends PanelElement


class Forecast extends PanelElement

  practice: ->
    new selenium.promise.Promise (resolve, reject) =>
      @element.findElement(css: 'button').click()
      @test.driver.wait =>
        @test.driver.isElementPresent(
          css: '.loadable.is-loading'
        ).then (isPresent) -> not isPresent

        resolve(new TaskStep(@test, '.task-step'))

  getTopic: ->
    new selenium.promise.Promise (resolve, reject) =>
      Promise.all([
        @element.findElement(css: '.number').getText()
        @element.findElement(css: '.title').getText()
      ]).then (texts) ->
        resolve({chapter_section: texts[0], title: texts[1]})

class ProgressGuide extends PanelElement

  getForecast: (options = {}) ->
    options.index ||= 0
    new Forecast(@test, ".chapter-panel .section:nth-of-type(#{options.index+1}")



class StudentDashboard extends PanelElement

  constructor: (test, @login, @courseTitle) ->
    super(test)
    @test.login(@login)
    CourseSelect.goToCourseByName(@test, @courseTitle)

  progressGuide: ->
    @test.driver.wait =>
      @test.driver.isElementPresent(css: '.loadable.is-loading').then (isPresent) -> not isPresent
    new ProgressGuide(@test, '.progress-guide')



module.exports = StudentDashboard


describe 'Student Dashboard', ->

  @beforeEach ->
    @dash = new StudentDashboard(@, 'student01', 'Biology I')

  @it 'Shows Performance Forecast', ->
    guide = @dash.progressGuide()
    expect(guide.valid).to.equal(true, 'Forecast is missing')

  @it 'can read forecast topic', ->
    forecast = @dash.progressGuide().getForecast(index: 0)
    forecast.getTopic().then (topic) ->
      expect(topic.chapter_section).to
        .equal('1.1', "First topic had incorrect chapter_section")

  @it 'Can practice Forecast', ->
    forecast = @dash.progressGuide().getForecast(index: 1)
    expect(forecast.valid).to.equal(true, 'Forecast was not found')
    forecast.practice().then (taskstep) ->
      expect(taskstep.valid).to.equal(true, 'Task Step is missing')
