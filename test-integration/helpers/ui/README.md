# Writing a spec

With the UI helper, a spec can look like this:

```coffee
{describe, User, CourseSelect, Calendar, ReadingBuilder} = require './helpers'
{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'

{CalendarHelper} = Calendar

describe 'Calendar and Stats', ->

  beforeEach ->
    @user = new User(@)
    @calendar = new CalendarHelper(@)
    @courseSelect = new CourseSelect(@)

    @user.login(TEACHER_USERNAME)

  @it 'Shows stats for all published plans (readonly)', ->
    COURSE_CATEGORY = 'BIOLOGY'
    @courseSelect.goTo(COURSE_CATEGORY)
    @calendar.waitUntilLoaded()

    @calendar.el.publishedPlan.forEach (plan, index, total) =>
      console.log 'Opening', COURSE_CATEGORY, index, '/', total
      plan.click()
      @calendar.el.planPopup.waitUntilLoaded()

      @calendar.el.planPopup.isPresent().then (isPresent) ->
        expect(isPresent).to.be.true

      # -- advance/detailed usage --
      popupTitle = @calendar.el.planPopup.getTitle()
      planTitle = @calendar.getPlanTitle(plan)

      selenium.promise.all([popupTitle, planTitle]).then ([popupTitle, planTitle]) ->
        expect(popupTitle).to.equal(planTitle)
      # /-- advance/detailed usage --

      @calendar.el.planPopup.el.periodReviewTab.forEach (period) ->
        period.click()

      @calendar.el.planPopup.close()

    @user.goHome()
```
