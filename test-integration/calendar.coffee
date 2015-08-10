{describe, CourseSelect, Calendar, ReadingBuilder} = require './helpers'
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'


describe 'Calendar and Stats', ->

  @it 'Just logs in (readonly)', ->
    @login(TEACHER_USERNAME)

  @xit 'Shows stats for all published plans (readonly)', ->
    @login(TEACHER_USERNAME)

    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) =>
      @addTimeout(60)
      CourseSelect.goTo(@, courseCategory)

      @forEach '.plan[data-isopen="true"]', (plan) =>
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


  @xit 'Opens the review page for every visible plan (readonly)', ->
    @login(TEACHER_USERNAME)

    _.each ['PHYSICS', 'BIOLOGY'], (courseCategory) =>
      CourseSelect.goTo(@, courseCategory)

      @forEach '.plan[data-isopen="true"]', (plan, index, total) =>
        @addTimeout(10)
        console.log 'Looking at', courseCategory, index, 'of', total
        plan.click()
        Calendar.Popup.verify(@)
        Calendar.Popup.goReview(@)

        @driver.sleep(1000)
        @waitClick(css: '.task-breadcrumbs button')
        @driver.sleep(1000)
        Calendar.Popup.verify(@)
        Calendar.Popup.close(@)
        Calendar.verify(@)

      # Go back to the course selection
      @waitClick(css: '.navbar-brand').then ->
        doneCheckingCount = 0

  @it 'Opens the learning guide for each course (readonly)', ->
    @login(TEACHER_USERNAME)

    _.each ['PHYSICS', 'BIOLOGY'], (courseCategory) =>
      @addTimeout(10)
      CourseSelect.goTo(@, courseCategory)

      Calendar.goLearningGuide(@)
      @waitAnd(css: '.guide-heading')
      @driver.findElements(css: '.panel .nav.nav-tabs li').then (periods) =>
        for period in periods
          period.click()

      @waitClick(css: '.back')

      # Go back to the course selection
      @waitClick(css: '.navbar-brand')


  @it 'Clicks through the performance report (readonly)', ->
    @login(TEACHER_USERNAME)

    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) =>
      CourseSelect.goTo(@, courseCategory)

      @waitClick(linkText: 'Performance Report').then => @addTimeout(60)
      @waitAnd(css: '.performance-report .course-performance-title')
      # BUG: Click on "Period 1"
      @waitClick(css: '.course-performance-wrap li:first-child')
      @waitAnd(css: '.course-performance-wrap li:first-child [aria-selected="true"]')
      @driver.sleep(500)

      @forEach '.task-result', (task, index, total) =>
        console.log 'opening', index, 'of', total
        @addTimeout(5)
        @scrollTo(task)
        task.click()
        @waitAnd(css: '.async-button.continue')
        # @waitClick(linkText: 'Back to Performance Report')
        @waitClick(css: '.pinned-footer a.btn-default')

        # BUG: Click on "Period 1"
        @waitClick(css: '.course-performance-wrap li:first-child')
        @waitAnd(css: '.course-performance-wrap li:first-child [aria-selected="true"]')
        @driver.sleep(2000)

      # Go back to the course selection
      @waitClick(css: '.navbar-brand')
