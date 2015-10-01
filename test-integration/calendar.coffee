{describe, CourseSelect, Calendar, ReadingBuilder} = require './helpers'
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'


describe 'Calendar and Stats', ->

  @xit 'Just logs in (readonly)', ->
    @login(TEACHER_USERNAME)

  @it 'Shows stats for all published plans (readonly)', ->
    @login(TEACHER_USERNAME)

    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) =>
      CourseSelect.goTo(@, courseCategory)

      # HACK: exclude the .continued plans because the center of the label may be off-screen
      @forEach '.plan.is-published label:not(.continued)', (plan, index, total) =>
        console.log 'Opening', courseCategory, index, '/', total
        plan.click()
        Calendar.Popup.verify(@)
        # Click on each of the periods
        @driver.findElements(css: '.panel .nav.nav-tabs li').then (periods) =>
          for period in periods
            period.click()
        Calendar.Popup.close(@)
        Calendar.verify(@)

      # Go back to the course selection
      @waitClick(css: '.navbar-brand')


  @it 'Opens the learning guide for each course (readonly)', ->
    @login(TEACHER_USERNAME)

    _.each ['PHYSICS', 'BIOLOGY'], (courseCategory) =>
      @addTimeout(10)
      CourseSelect.goTo(@, courseCategory)

      Calendar.goLearningGuide(@)
      @waitAnd(css: '.guide-heading')
      @forEach '.panel .nav.nav-tabs li', (period) ->
        period.click()

      @waitClick(css: '.back')

      # Go back to the course selection
      @waitClick(css: '.navbar-brand')


  @it 'Opens the review page for every visible plan (readonly)', ->
    @login(TEACHER_USERNAME)

    _.each ['PHYSICS', 'BIOLOGY'], (courseCategory) =>
      CourseSelect.goTo(@, courseCategory)

      # HACK: exclude the .continued plans because the center of the label may be off-screen
      @forEach '.plan.is-open.is-published label:not(.continued)', (plan, index, total) =>
        @addTimeout(10)
        console.log 'Looking at Review for', courseCategory, index, 'of', total
        plan.click()
        Calendar.Popup.verify(@)
        Calendar.Popup.goReview(@)

        @sleep(1000)
        # Loop over each tab
        @forEach '.panel .nav.nav-tabs li', (period) ->
          period.click()

        # TODO: Better way of targeting the "Back" button
        # BUG: Back button goes back to course listing instead of calendar
        @driver.navigate().back()

        @sleep(1000)
        Calendar.Popup.verify(@)
        Calendar.Popup.close(@)
        Calendar.verify(@)

      # Go back to the course selection
      @waitClick(css: '.navbar-brand')


  @it 'Clicks through the Student Scores (readonly)', ->
    @login(TEACHER_USERNAME)

    # The facebook table has some "fancy" elements that don't move when the table
    # scrolls vertically. Unfortunately, they cover the links.
    # There is a UI "border shadow" element that ends up going right
    # through the middle of a link. So, just hide the element
    @addTimeoutMs(1000)
    @driver.executeScript ->
      hider = document.createElement('style')
      hider.textContent = '.public_fixedDataTable_bottomShadow { display: none; }'
      document.head.appendChild(hider)


    _.each ['PHYSICS', 'BIOLOGY'], (courseCategory) =>
      CourseSelect.goTo(@, courseCategory)

      @waitClick(linkText: 'Student Scores').then => @addTimeout(60)
      @waitAnd(css: '.scores-report .course-scores-title')
      @sleep(500)

      # Click the "Review" links (each task-plan)
      @forEach '.review-plan', (item, index, total) =>
        console.log 'opening Review', courseCategory, index, 'of', total
        item.click()
        @waitClick(css: '.task-breadcrumbs > a')
        @waitAnd(css: '.course-scores-wrap')

      # Click each Student Forecast
      @forEach css: '.student-name', ignoreLengthChange: true, (item, index, total) =>
        console.log 'opening Student Forecast', courseCategory, index, 'of', total
        item.click()
        @waitAnd(css: '.chapter-panel.weaker, .no-data-message')
        @waitClick(css: '.learning-guide a.back')
        @waitAnd(css: '.course-scores-wrap')

      # only test the 1st row of each Student Response
      @forEach '.fixedDataTableRowLayout_rowWrapper:nth-of-type(1) .task-result', (item, index, total) =>
        console.log 'opening Student view', courseCategory, index, 'of', total
        item.click()
        @waitAnd(css: '.async-button.continue')
        # @waitClick(linkText: 'Back to Student Scores')
        @waitClick(css: '.pinned-footer a.btn-default')

        # # BUG: Click on "Period 1"
        # @waitClick(css: '.course-scores-wrap li:first-child')
        # @waitAnd(css: '.course-scores-wrap li:first-child [aria-selected="true"]')
        @sleep(2000)

      # Go back to the course selection
      @waitClick(css: '.navbar-brand')
