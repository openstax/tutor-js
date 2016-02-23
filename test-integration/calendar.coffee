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
        @courseSelect.goToByType(courseCategory)
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
    # The facebook table has some "fancy" elements that don't move when the table
    # scrolls vertically. Unfortunately, they cover the links.
    # There is a UI "border shadow" element that ends up going right
    # through the middle of a link. So, just hide the element
    @addTimeoutMs(1000)
    @driver.executeScript ->
      hider = document.createElement('style')
      hider.textContent = '.public_fixedDataTable_bottomShadow { display: none; }'
      document.head.appendChild(hider)

    @calendar.goToScores()
    @scores.waitUntilLoaded()
    @addTimeout(60)
    @utils.wait.for({css: '.scores-report .course-scores-title'})

    # Click the "Review" links (each task-plan)
    @utils.wait.click({css: '.review-plan'})
    # Depending on the type of plan, the "Back to Scores" button could be pinned to the bottom (iReading) or up by the breadcrumbs (HW)
    @utils.wait.for({css: '.task-step .pinned-footer .btn-default:not([disabled]), .task-breadcrumbs .btn-default:not([disabled])'})
    @utils.wait.click({css: '.task-step .pinned-footer .btn-default:not([disabled]), .task-breadcrumbs .btn-default:not([disabled])'})
    @utils.wait.for({css: '.course-scores-wrap'})

    # Click each Student Forecast
    @utils.wait.click({css: '.student-name'})
    # console.log 'opening Student Forecast', courseCategory, index, 'of', total
    @utils.wait.for({css: '.chapter-panel.weaker, .no-data-message'})
    @utils.wait.click({css: '.performance-forecast a.back'})
    @utils.wait.for({css: '.course-scores-wrap'})

    # only test the 1st row of each Student Response
    @utils.wait.click({css: '.fixedDataTableRowLayout_rowWrapper:nth-of-type(1) .task-result'})
    # console.log 'opening Student view', courseCategory, index, 'of', total
    @utils.wait.for({css: '.async-button.continue'})
    # @utils.wait.click(linkText: 'Back to Student Scores')
    # Depending on the type of plan, the "Back to Scores" button could be pinned to the bottom (iReading) or up by the breadcrumbs (HW)
    @utils.wait.for({css: '.task-step .pinned-footer .btn-default:not([disabled]), .task-breadcrumbs .btn-default:not([disabled])'})
    el = @driver.findElement({css: '.task-step .pinned-footer .btn-default:not([disabled]), .task-breadcrumbs .btn-default:not([disabled])'})
    @utils.windowPosition.scrollTo(el)
    @utils.wait.click({css: '.task-step .pinned-footer .btn-default:not([disabled]), .task-breadcrumbs .btn-default:not([disabled])'})

    # # BUG: Click on "Period 1"
    # @utils.wait.click({css: '.course-scores-wrap li:first-child'})
    # @utils.wait.for({css: '.course-scores-wrap li:first-child [aria-selected="true"]'})
