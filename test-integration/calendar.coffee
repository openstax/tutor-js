{describe, forEach, User, CourseSelect, wait, Calendar, ReadingBuilder} = require './helpers'
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'


describe 'Calendar and Stats', ->

  @xit 'Just logs in (readonly)', ->
    new User(@, TEACHER_USERNAME).login()

  @it 'Shows stats for all published plans (readonly)', ->
    new User(@, TEACHER_USERNAME).login()
    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) =>
      new CourseSelect(@).goTo(courseCategory)

      # HACK: exclude the .continued plans because the center of the label may be off-screen
      forEach @, css: '.plan.is-published label:not(.continued)', (plan, index, total) =>
        console.log 'Opening', courseCategory, index, '/', total
        plan.click()
        Calendar.Popup.verify(@)
        # Click on each of the periods
        @driver.findElements(css: '.panel .nav.nav-tabs li').then (periods) ->
          for period in periods
            period.click()
        Calendar.Popup.close(@)
        Calendar.verify(@)

      # Go back to the course selection
      wait(@).click(css: '.navbar-brand')


  @it 'Opens the learning guide for each course (readonly)', ->
    new User(@, TEACHER_USERNAME).login()

    _.each ['PHYSICS', 'BIOLOGY'], (courseCategory) =>
      @addTimeout(10)
      new CourseSelect(@).goTo(courseCategory)

      Calendar.goPerformanceForecast(@)
      wait(@).for(css: '.guide-heading')
      forEach @, css: '.panel .nav.nav-tabs li', (period) ->
        period.click()

      wait(@).click(css: '.back')

      # Go back to the course selection
      wait(@).click(css: '.navbar-brand')


  @it 'Opens the review page for every visible plan (readonly)', ->
    new User(@, TEACHER_USERNAME).login()

    _.each ['PHYSICS', 'BIOLOGY'], (courseCategory) =>
      new CourseSelect(@).goTo(courseCategory)

      # HACK: exclude the .continued plans because the center of the label may be off-screen
      forEach @, css: '.plan.is-open.is-published label:not(.continued)', (plan, index, total) =>
        @addTimeout(10)
        console.log 'Looking at Review for', courseCategory, index, 'of', total
        plan.click()
        Calendar.Popup.verify(@)
        Calendar.Popup.goReview(@)

        # Loop over each tab
        forEach @, css: '.panel .nav.nav-tabs li', (period) ->
          period.click()

        # TODO: Better way of targeting the "Back" button
        # BUG: Back button goes back to course listing instead of calendar
        @driver.navigate().back()

        Calendar.Popup.verify(@)
        Calendar.Popup.close(@)
        Calendar.verify(@)

      # Go back to the course selection
      wait(@).click(css: '.navbar-brand')


  @it 'Clicks through the Student Scores (readonly)', ->
    new User(@, TEACHER_USERNAME).login()

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
      new CourseSelect(@).goTo(courseCategory)

      wait(@).click(linkText: 'Student Scores').then => @addTimeout(60)
      wait(@).for(css: '.scores-report .course-scores-title')

      # Click the "Review" links (each task-plan)
      forEach @, css: '.review-plan', (item, index, total) =>
        console.log 'opening Review', courseCategory, index, 'of', total
        item.click()
        wait(@).click(css: '.task-breadcrumbs > a')
        wait(@).for(css: '.course-scores-wrap')

      # Click each Student Forecast
      forEach @, css: '.student-name', ignoreLengthChange: true, (item, index, total) =>
        console.log 'opening Student Forecast', courseCategory, index, 'of', total
        item.click()
        wait(@).for(css: '.chapter-panel.weaker, .no-data-message')
        wait(@).click(css: '.performance-forecast a.back')
        wait(@).for(css: '.course-scores-wrap')

      # only test the 1st row of each Student Response
      forEach @, css: '.fixedDataTableRowLayout_rowWrapper:nth-of-type(1) .task-result', (item, index, total) =>
        console.log 'opening Student view', courseCategory, index, 'of', total
        item.click()
        wait(@).for(css: '.async-button.continue')
        # wait(@).click(linkText: 'Back to Student Scores')
        wait(@).click(css: '.pinned-footer a.btn-default')

        # # BUG: Click on "Period 1"
        # wait(@).click(css: '.course-scores-wrap li:first-child')
        # wait(@).for(css: '.course-scores-wrap li:first-child [aria-selected="true"]')

      # Go back to the course selection
      wait(@).click(css: '.navbar-brand')
