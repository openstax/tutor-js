_ = require 'underscore'
CourseSelect = require './course-select'

# A base class for a "Panel" type DOM object
# If anyone finds this useful, feel free to expand and extract to helpers
class PanelElement

  constructor: (test, el) ->
    @_test = test
    if _.isString(el)
      el = @test.driver.findElement(css: el)
    @_element = el

# Using defined properties for access eliminates the possibility
# of accidental assignment
Object.defineProperties PanelElement.prototype,
  valid:
    get: -> !!@_element
  element:
    get: -> @_element
  test:
    get: -> @_test


# TODO: Remove this and return instances
# of tasks helpers once they're in place
class TaskStep extends PanelElement

  getExerciseId: ->
    @element.findElement(css: '.exercise-uid').getText()


class Forecast extends PanelElement

  practice: ->
    new Promise (resolve, reject) =>
      btn = @element.findElement(css: 'button')
      btn.click().then =>
        @test.waitAnd(css: '.task-step').then =>
          @test.scrollTop()
          resolve(new TaskStep(@test, '.task-step'))

  getTopic: ->
    new Promise (resolve, reject) =>
      Promise.all([
        @element.findElement(css: '.number').getText()
        @element.findElement(css: '.title').getText()
      ]).then (texts) =>
        @test.scrollTop()
        resolve({chapter_section: texts[0], title: texts[1]})

class ProgressGuide extends PanelElement

  getForecast: (options = {}) ->
    options.index ||= 0
    new Forecast(@test, ".chapter-panel .section:nth-of-type(#{options.index+1}")


class DashboardTask extends PanelElement

  getTitle: ->
    @element.findElement(css: '.title').getText()

  getProgress: ->
    @element.findElement(css: '.feedback').getText()


class StudentDashboard extends PanelElement

  constructor: (test, @login, @courseTitle) ->
    super(test)
    @test.login(@login)
    CourseSelect.goToCourseByName(@test, @courseTitle)
    @test.driver.wait =>
      @test.driver.isElementPresent(css: '.loadable.is-loading').then (isPresent) -> not isPresent
    @_element = @test.waitAnd(css: '.student-dashboard')

  progressGuide: ->
    new ProgressGuide(@test, '.progress-guide')

  getAllVisibleTasks: ->
    new Promise (resolve, reject) =>
      @element.findElements(css: '.tab-pane.active .task').then (elements) =>
        tasks = _.map elements, (el) =>
          new DashboardTask(@test, el)
        resolve(tasks)

  findVisibleTask: (query) ->
    new Promise (resolve, reject) =>
      @getAllVisibleTasks().then (tasks) ->
        found = false
        titlepromises = _.invoke(tasks, 'getTitle')
        Promise.all(titlepromises).then (titles) ->
          for title, i in titles
            if title is query.title
              found = true
              resolve(tasks[i])
          resolve(null) unless found

module.exports = StudentDashboard
