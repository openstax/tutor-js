{describe, User, CourseSelect, Calendar, Scores} = require './helpers'
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'

{CalendarHelper} = Calendar
{ScoresHelper} = Scores

describe 'Student Scores', ->

  beforeEach ->
    @user = new User(@)
    @calendar = new CalendarHelper(@)
    @scores = new ScoresHelper(@)
    @courseSelect = new CourseSelect(@)

    @user.login(TEACHER_USERNAME)


  @eachCourse = (msg, fn) =>
    _.each ['BIOLOGY', 'PHYSICS'], (courseCategory) => @it msg, ->
      @courseSelect.goTo(courseCategory)
      @calendar.goStudentScores()
      fn.call(@, courseCategory)
      @user.goHome()


  # @eachCourse 'Shows Periods', (courseCategory) ->
  #   @
  #   @calendar.el.publishedPlan.forEach (plan, index, total) =>
  #     console.log 'Opening', courseCategory, index, '/', total
  #     plan.click()
  #     @calendar.el.planPopup.waitUntilLoaded()

  #     @calendar.el.planPopup.el.periodReviewTab.forEach (period) ->
  #       period.click()

  #     @calendar.el.planPopup.close()
  #     @calendar.waitUntilLoaded()
