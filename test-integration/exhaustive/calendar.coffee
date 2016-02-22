{describe, User, CourseSelect, Calendar} = require '../helpers'
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'

{CalendarHelper} = Calendar

describe 'Calendar and Stats', ->

  @eachCourse = (msg, fn) =>
    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) => @it msg, ->
      @courseSelect.goTo(courseCategory)
      @calendar.waitUntilLoaded()
      fn.call(@, courseCategory)
      # Go back to the course selection after the spec
      @user.goHome()

  beforeEach ->
    @user = new User(@)
    @calendar = new CalendarHelper(@)
    @courseSelect = new CourseSelect(@)

    @user.login(TEACHER_USERNAME)

  @eachCourse 'Shows stats for all published plans (readonly)', (courseCategory) ->
    @calendar.el.publishedPlan.forEach (plan, index, total) =>
      console.log 'Opening', courseCategory, index, '/', total
      plan.click()
      @calendar.el.planPopup.waitUntilLoaded()

      @calendar.el.planPopup.el.periodReviewTab.forEach (period) ->
        period.click()

      @calendar.el.planPopup.close()
      @calendar.waitUntilLoaded()


  @eachCourse 'Opens the review page for every visible plan (readonly)', (courseCategory) ->
    @calendar.el.openPlan.forEach (plan, index, total) =>
      @addTimeout(10)
      console.log 'Looking at Review for', courseCategory, index, 'of', total
      plan.click()
      @calendar.el.planPopup.waitUntilLoaded()
      @calendar.el.planPopup.goReview()

      # TODO: review helper
      @utils.wait.for(css: '.task-teacher-review .task-breadcrumbs')
      # Loop over each tab
      @utils.forEach css: '.panel .nav.nav-tabs li', (period) ->
        period.click()
      # TODO: Better way of targeting the "Back" button
      # BUG: Back button goes back to course listing instead of calendar
      @driver.navigate().back()

      @calendar.el.planPopup.waitUntilLoaded()
      @calendar.el.planPopup.close()
      @calendar.waitUntilLoaded()


  @eachCourse 'Opens the learning guide for each course (readonly)', (courseCategory) ->
    @addTimeout(10)
    @calendar.goPerformanceForecast()

    # TODO: guide helper.
    @utils.wait.for(css: '.guide-heading')
    @utils.forEach css: '.panel .nav.nav-tabs li', (period) ->
      period.click()
    @utils.wait.click(css: '.back')


  @eachCourse 'Clicks through the Student Scores (readonly)', (courseCategory) ->
    # The facebook table has some "fancy" elements that don't move when the table
    # scrolls vertically. Unfortunately, they cover the links.
    # There is a UI "border shadow" element that ends up going right
    # through the middle of a link. So, just hide the element
    @addTimeoutMs(1000)
    @driver.executeScript ->
      hider = document.createElement('style')
      hider.textContent = '.public_fixedDataTable_bottomShadow { display: none; }'
      document.head.appendChild(hider)

    @calendar.goStudentScores().then => @addTimeout(60)
    @utils.wait.for(css: '.scores-report .course-scores-title')

    # Click the "Review" links (each task-plan)
    @utils.forEach css: '.review-plan', (item, index, total) =>
      console.log 'opening Review', courseCategory, index, 'of', total
      item.click()
      @utils.wait.click(css: '.task-breadcrumbs > a')
      @utils.wait.for(css: '.course-scores-wrap')

    # Click each Student Forecast
    @utils.forEach css: '.student-name', ignoreLengthChange: true, (item, index, total) =>
      console.log 'opening Student Forecast', courseCategory, index, 'of', total
      item.click()
      @utils.wait.for(css: '.chapter-panel.weaker, .no-data-message')
      @utils.wait.click(css: '.performance-forecast a.back')
      @utils.wait.for(css: '.course-scores-wrap')

    # only test the 1st row of each Student Response
    @utils.forEach css: '.fixedDataTableRowLayout_rowWrapper:nth-of-type(1) .task-result', (item, index, total) =>
      console.log 'opening Student view', courseCategory, index, 'of', total
      item.click()
      @utils.wait.for(css: '.async-button.continue')
      # @utils.wait.click(linkText: 'Back to Student Scores')
      @utils.wait.click(css: '.pinned-footer a.btn-default')

      # # BUG: Click on "Period 1"
      # @utils.wait.click(css: '.course-scores-wrap li:first-child')
      # @utils.wait.for(css: '.course-scores-wrap li:first-child [aria-selected="true"]')
