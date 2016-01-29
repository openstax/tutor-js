{describe, CourseSelect, Task, User} = require './helpers'
{expect} = require 'chai'
_ = require 'underscore'
selenium = require 'selenium-webdriver'

{TaskHelper} = Task

STUDENT_USERNAME = 'student01'


describe 'Student performing tasks', ->

  beforeEach ->
    @user = new User(@, STUDENT_USERNAME)
    @task = new TaskHelper(@)
    @courseSelect = new CourseSelect(@)

    @user.login()

  @it 'Can continue and go to expected steps (readonly)', ->

    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) =>
      @courseSelect.goTo(courseCategory)

      @utils.wait.click(css: '.workable.task')

      @task.waitUntilLoaded(2000)
      @task.getEnabledContinueButton().click()
      @task.getEnabledContinueButton().click()
      # get multiple seems to not be working right now.
      # @task.getStepCrumbs(4).then (crumb) ->
      #   crumb.click()

      # Go back to the course selection
      @user.goHome()


  @it 'Can continue (readonly)', ->

    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) =>
      @courseSelect.goTo(courseCategory)

      @utils.wait.click(css: '.workable.task')

      @task.waitUntilLoaded(2000)
      @task.continue()

      # Go back to the course selection
      @user.goHome()
