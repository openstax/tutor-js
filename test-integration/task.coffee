{describe, CourseSelect, Task} = require './helpers'
{expect} = require 'chai'
_ = require 'underscore'
selenium = require 'selenium-webdriver'

{TaskElement, TaskHelper} = Task

STUDENT_USERNAME = 'student01'


describe 'Student performing tasks', ->

  beforeEach ->
    @task = new TaskHelper(@)

  @it 'Can continue and go to expected steps (readonly)', ->
    @login(STUDENT_USERNAME)

    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) =>
      appearance = courseCategory.toLowerCase()
      @waitClick(css: "[data-appearance='#{appearance}'] > [href*='list']")

      @waitClick(css: '.workable.task')

      @task.waitUntilLoaded(2000)
      @task.enabledContinueButton.get().click()
      @task.enabledContinueButton.get().click()
      @task.stepCrumbs.get(4).then (crumb) ->
        crumb.click()

      # Go back to the course selection
      @waitClick(css: '.navbar-brand')


  @it 'Can continue (readonly)', ->
    @login(STUDENT_USERNAME)

    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) =>
      appearance = courseCategory.toLowerCase()
      @waitClick(css: "[data-appearance='#{appearance}'] > [href*='list']")

      @waitClick(css: '.workable.task')

      @task.waitUntilLoaded(2000)
      @task.continue()
      @task.continue()
      @task.continue()
      @task.continue()
      @task.continue()

      # Go back to the course selection
      @waitClick(css: '.navbar-brand')
