{describe, CourseSelect, forEach, Calendar, User, ReadingBuilder} = require '../helpers'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'

{CalendarHelper} =  Calendar

describe 'Assignment Cleanup', ->

  beforeEach ->
    new User(@).login(TEACHER_USERNAME)
    @addTimeout(2)
    new CourseSelect(@).goTo('ANY')

    @calendar = new CalendarHelper(@)
    @reading = new ReadingBuilder(@)

    @calendar.waitUntilLoaded()

  @it 'Deletes all drafts (not really a test but nice cleanup)', ->
    @calendar.el.draftPlan.forEach (plan, index, total) =>
      plan.click()
      @reading.waitUntilLoaded()
      @reading.edit(action: 'DELETE').then ->
        console.log 'Deleted', index, '/', total
      @calendar.waitUntilLoaded()

    , (plans) ->
      console.log "Deleting #{plans.length} Drafts..." if plans.length


    # Delete published but not opened plans
    @calendar.el.unopenPlan.forEach (plan, index, total) =>
      @addTimeout(10) # Published plans take a while to delete
      plan.click()
      @calendar.el.planPopup.waitUntilLoaded()
      @calendar.el.planPopup.goEdit()
      @reading.edit(action: 'DELETE').then ->
        console.log 'Deleted', index, '/', total
      @calendar.waitUntilLoaded()

    , (plans) ->
      console.log "Deleting #{plans.length} Unopened..." if plans.length
