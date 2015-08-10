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

      doneCheckingCount = 0
      @driver.findElements(css: '.plan[data-isopen="true"]').then (plans) =>

        _.each plans, (plan) =>
          # Since the DOM node will be stale re-query all the plans.
          # Could have squirreled away all the titles & used those but I'm lazy
          @driver.findElements(css: '.plan[data-isopen="true"]').then (plans2) =>
            plan = plans2[doneCheckingCount]

            plan.click().then -> console.log 'Looking at', courseCategory, doneCheckingCount
            Calendar.Popup.verify(@)
            Calendar.Popup.goReview(@)

            @driver.sleep(1000)
            @waitClick(css: '.task-breadcrumbs button')
            @driver.sleep(1000)
            Calendar.Popup.verify(@)
            Calendar.Popup.close(@)
            Calendar.verify(@).then ->
              doneCheckingCount += 1

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


  @it 'Clicks through the performance report (readonly)', ->
    @timeout 4 * 60 * 1000

    @login(TEACHER_USERNAME)

    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) =>
      CourseSelect.goTo(@, courseCategory)

      @waitClick(linkText: 'Performance Report')
      @waitAnd(css: '.performance-report .course-performance-title')

      @driver.findElements(css: '.task-result').then (tasks) =>
        expect(tasks.length).to.not.equal(0)
        console.log 'Assignments', courseCategory, tasks.length

        for i in [0...tasks.length]
          do (i) =>
            @driver.findElements(css: '.task-result').then (tasks2) =>
              task = tasks2[i]

              @scrollTo(task)
              task.click().then -> console.log 'opening', i
              @waitAnd(css: '.async-button.continue')
              # @waitClick(linkText: 'Back to Performance Report')
              @waitClick(css: '.pinned-footer a.btn-default')


      # Go back to the course selection
      @waitClick(css: '.navbar-brand')
