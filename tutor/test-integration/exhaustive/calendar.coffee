Helpers = require '../helpers'
{describe} = Helpers
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'

describe 'Calendar and Stats', ->

  @eachCourse = (msg, fn) =>
    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) => @it msg, ->
      @courseSelect.goToByType(courseCategory)
      @calendar.waitUntilLoaded()
      fn.call(@, courseCategory)
      # Go back to the course selection after the spec
      @user.goToHome()

  beforeEach ->
    @user = new Helpers.User(@)
    @calendar = new Helpers.Calendar(@)
    @calendarPopup = new Helpers.Calendar.Popup(@)
    @courseSelect = new Helpers.CourseSelect(@)
    @scores = new Helpers.Scores(@)
    @taskPlanReview = new Helpers.TaskPlanReview(@)
    @taskTeacher = new Helpers.TaskTeacher(@)
    @forecast = new Helpers.Forecast(@)

    @user.login(TEACHER_USERNAME)

  @eachCourse 'Shows stats for all published plans (readonly)', (courseCategory) ->
    @calendar.el.publishedPlan.forEach (plan, index, total) =>
      console.log 'Opening', courseCategory, index, '/', total
      plan.click()
      @calendarPopup.waitUntilLoaded()

      @calendarPopup.el.periodReviewTab.forEach (period) ->
        period.click()

      @calendarPopup.close()
      @calendar.waitUntilLoaded()


  @eachCourse 'Shows LMS Info for all published homeworks', (courseCategory) ->
    @calendar.el.publishedHomework.forEach (plan, index, total) =>
      plan.click()
      @calendarPopup.waitUntilLoaded()

      @calendar.getLmsPopover().getText().then (txt) ->
        expect(txt).to.contain('Copy information for your LMS')

      @calendarPopup.close()
      @calendar.waitUntilLoaded()



  # TODO -- probably broken, fix
  @eachCourse 'Opens the review page for every visible plan (readonly)', (courseCategory) ->
    @calendar.el.openPlan.forEach (plan, index, total) =>
      @addTimeout(10)
      console.log 'Looking at Review for', courseCategory, index, 'of', total
      plan.click()
      @calendarPopup.waitUntilLoaded()
      @calendarPopup.goToReview()

      # TODO: review helper
      @utils.wait.for(css: '.task-teacher-review .task-breadcrumbs')
      # Loop over each tab
      @utils.forEach css: '.panel .nav.nav-tabs li', (period) ->
        period.click()
      # TODO: Better way of targeting the "Back" button
      # BUG: Back button goes back to course listing instead of calendar
      @driver.navigate().back()

      @calendarPopup.waitUntilLoaded()
      @calendarPopup.close()
      @calendar.waitUntilLoaded()

  # TODO -- probably broken, fix
  @eachCourse 'Opens the learning guide for each course (readonly)', (courseCategory) ->
    @addTimeout(10)
    @calendar.goToForecast()

    # TODO: guide helper.
    @utils.wait.for(css: '.guide-heading')
    @utils.forEach css: '.panel .nav.nav-tabs li', (period) ->
      period.click()
    @utils.wait.click(css: '.back')


  @eachCourse 'Clicks through the Student Scores (readonly)', (courseCategory) ->

    @calendar.goToScores()
    @scores.waitUntilLoaded()

    @scores.goToPeriodWithAssignments()
    # Click the "Review" links (each task-plan)
    @scores.el.hsReviewLink().forEach (item, index, total) =>
      console.log 'opening Review', courseCategory, index, 'of', total
      item.click()
      @taskPlanReview.waitUntilLoaded()
      @taskPlanReview.el.backToScores().click()
      @scores.goToPeriodWithAssignments()

    @scores.goToPeriodWithAssignments()
    # Click each Student Forecast
    @scores.el.hsNameLink(ignoreLengthChange: true).forEach (item, index, total) =>
      console.log 'opening Student Forecast', courseCategory, index, 'of', total
      item.click()
      @forecast.waitUntilLoaded()
      @forecast.el.back().click()
      @scores.goToPeriodWithAssignments()

    # this may not find any period :( depending on the stubbed data.
    @scores.goToPeriodWithWorkedAssignments(1)
    # only test the 1st row of each Student Response
    @scores.el.taskResultByRow(1).forEach (item, index, total) =>
      console.log 'opening Student view', courseCategory, index, 'of', total
      item.click()
      @taskTeacher.waitUntilLoaded()
      @taskTeacher.el.backToScores().click()
      @scores.goToPeriodWithAssignments()

      # # BUG: Click on "Period 1"
      # @utils.wait.click(css: '.course-scores-wrap li:first-child')
      # @utils.wait.for(css: '.course-scores-wrap li:first-child [aria-selected="true"]')
