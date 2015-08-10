{describe, CourseSelect, Calendar, ReadingBuilder} = require './helpers'
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'


describe 'Calendar and Stats', ->

  @xit 'Shows stats for all published plans (readonly)', ->
    @timeout 2 * 60 * 1000

    @login(TEACHER_USERNAME)

    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) =>
      CourseSelect.goTo(@, courseCategory)

      @driver.findElements(css: '.plan[data-isopen="true"]').then (plans) =>
        _.each plans, (plan) =>
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
    @timeout 10 * 60 * 1000

    @login(TEACHER_USERNAME)

    _.each ['PHYSICS', 'BIOLOGY'], (courseCategory) =>
      CourseSelect.goTo(@, courseCategory)

      @forEach '.plan[data-isopen="true"]', (plan, index, total) =>
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
    @timeout 60 * 1000

    @login(TEACHER_USERNAME)

    _.each ['PHYSICS', 'BIOLOGY'], (courseCategory) =>
      CourseSelect.goTo(@, courseCategory)

      Calendar.goLearningGuide(@)
      @waitAnd(css: '.guide-heading')
      @driver.findElements(css: '.panel .nav.nav-tabs li').then (periods) =>
        for period in periods
          period.click()

      @waitClick(css: '.back')

      # Go back to the course selection
      @waitClick(css: '.navbar-brand')


  @xit 'Clicks through the performance report (readonly)', ->
    @timeout 10 * 60 * 1000

    @login(TEACHER_USERNAME)

    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) =>
      CourseSelect.goTo(@, courseCategory)

      @waitClick(linkText: 'Performance Report')
      @waitAnd(css: '.performance-report .course-performance-title')
      # BUG: Click on "Period 1"
      @waitClick(css: '.course-performance-wrap li:first-child')
      @waitAnd(css: '.course-performance-wrap li:first-child [aria-selected="true"]')
      @driver.sleep(100)

      @forEach '.task-result', (task, index, total) =>
        console.log 'opening', index, 'of', total
        @scrollTo(task)
        task.click()
        @waitAnd(css: '.async-button.continue')
        # @waitClick(linkText: 'Back to Performance Report')
        @waitClick(css: '.pinned-footer a.btn-default')

        # BUG: Click on "Period 1"
        @waitClick(css: '.course-performance-wrap li:first-child')
        @waitAnd(css: '.course-performance-wrap li:first-child [aria-selected="true"]')
        @driver.sleep(1000)

      # Go back to the course selection
      @waitClick(css: '.navbar-brand')
