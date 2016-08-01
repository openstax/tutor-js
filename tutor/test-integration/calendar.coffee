Helpers = require './helpers'
{describe} = Helpers
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'

# Quick test that nothing "blows up". For a more exhaustive version that clicks on all the items, see "./exhaustive"

describe 'Calendar and Stats', ->

  @eachCourse = (msg, fn) =>
    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) =>
      @it "#{msg} for #{courseCategory}", (done) ->
        @courseSelect.goToByType(courseCategory, 'teacher')
        @calendar.waitUntilLoaded()
        fn.call(@, courseCategory)
        # Go back to the course selection after the spec
        @user.goToHome()
        done()

  beforeEach ->
    @user = new Helpers.User(@)
    @calendar = new Helpers.Calendar(@)
    @courseSelect = new Helpers.CourseSelect(@)
    @scores = new Helpers.Scores(@)
    @taskPlanReview = new Helpers.TaskPlanReview(@)
    @taskTeacher = new Helpers.TaskTeacher(@)
    @forecast = new Helpers.Forecast(@)

    @user.login(TEACHER_USERNAME)

  # These are commmented because they assume the existence of a plan to click on
  # @eachCourse 'Shows stats for a published plan (readonly)', (courseCategory) ->
  #   {publishedPlan, planPopup} = @calendar.el
  #   publishedPlan.get().click()
  #   planPopup.waitUntilLoaded()
  #   planPopup.el.periodReviewTab.get().click()
  #   planPopup.close()
  #   @calendar.waitUntilLoaded()
  #
  # @eachCourse 'Opens the review page for a visible plan (readonly)', (courseCategory) ->
  #   {publishedPlan, planPopup} = @calendar.el
  #   publishedPlan.get().click()
  #   planPopup.waitUntilLoaded()
  #
  #   planPopup.goToReview()
  #
  #   # TODO: review helper
  #   @utils.wait.for({css: '.task-teacher-review .task-breadcrumbs'});
  #   # Loop over each tab
  #   @utils.forEach({css: '.panel .nav.nav-tabs li'}, (period) -> period.click())
  #   # TODO: Better way of targeting the "Back" button
  #   # BUG: Back button goes back to course listing instead of calendar
  #   @driver.navigate().back()
  #
  #   planPopup.waitUntilLoaded()
  #   planPopup.close()
  #   @calendar.waitUntilLoaded()
  #

  @eachCourse 'Opens the learning guide (readonly)', (courseCategory) ->
    @calendar.goToForecast()

    # TODO: guide helper.
    @utils.wait.for({css: '.guide-heading'})
    @utils.forEach({css: '.panel .nav.nav-tabs li'}, (period) -> period.click())
    @utils.wait.click({css: '.back'})



  @eachCourse 'Clicks an item in the Student Scores (readonly)', (courseCategory) ->

    @calendar.goToScores()
    @scores.waitUntilLoaded()

    @scores.goToPeriodWithAssignments()
    # Click the "Review" links (each task-plan)
    @scores.el.hsReviewLink().click()
    @taskPlanReview.waitUntilLoaded()
    @taskPlanReview.el.backToScores().click()

    @scores.goToPeriodWithAssignments()
    # Click each Student Forecast
    @scores.el.hsNameLink().click()
    # console.log 'opening Student Forecast', courseCategory, index, 'of', total
    @forecast.waitUntilLoaded()
    @forecast.el.back().click()

    @scores.goToPeriodWithWorkedAssignments()
    # only test the 1st row of each Student Response (skip if students have not answered something)
    @scores.el.taskResultByRow().isDisplayed().then (isDisplayed) =>
      if isDisplayed
        @scores.el.taskResultByRow().click()
        # console.log 'opening Student view', courseCategory, index, 'of', total
        @taskTeacher.waitUntilLoaded()
        # @utils.wait.click(linkText: 'Back to Student Scores')
        @taskTeacher.el.backToScores().click()
      else
        console.log 'No clickable scores were found so Skipping (but passing the test). Probably because students did not work anything yet'

    # # BUG: Click on "Period 1"
    # @utils.wait.click({css: '.course-scores-wrap li:first-child'})
    # @utils.wait.for({css: '.course-scores-wrap li:first-child [aria-selected="true"]'})
