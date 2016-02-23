Helpers = require './helpers'
{describe} = Helpers
{expect} = require 'chai'
_ = require 'underscore'
selenium = require 'selenium-webdriver'

STUDENT_USERNAME = 'student01'


describe 'Student performing tasks', ->

  beforeEach ->
    @user = new Helpers.User(@)
    @task = new Helpers.Task(@)
    @courseSelect = new Helpers.CourseSelect(@)
    @dashboard = new Helpers.StudentDashboard(@)

    @user.login(STUDENT_USERNAME)

    @courseSelect.goTo('ANY')

  @it 'Can continue and go to expected steps (readonly)', ->
    @dashboard.el.workableTask.isPresent().then (isPresent) =>
      return console.log('No Workable tasks to click on so skipping') unless isPresent

      @dashboard.el.workableTask.click()
      @task.waitUntilLoaded()

      # demonstrating get in spec.
      # If the task can continue, then continue
      @task.canContinue().then (canContinue) => @task.continue() if canContinue
      @task.canContinue().then (canContinue) => @task.continue() if canContinue
      @task.canContinue().then (canContinue) => @task.continue() if canContinue
      # get multiple seems to not be working right now.
      # @task.getStepCrumbs(4).then (crumb) ->
      #   crumb.click()

      # Go back to the course selection
      @user.goHome()


  @it 'Can continue (readonly)', ->
    @dashboard.el.workableTask.isPresent().then (isPresent) =>
      return console.log('No Workable tasks to click on so skipping') unless isPresent

      @dashboard.el.workableTask.click()
      @task.waitUntilLoaded()

      @task.canContinue().then (canContinue) => @task.continue() if canContinue

      # Go back to the course selection
      @user.goHome()
