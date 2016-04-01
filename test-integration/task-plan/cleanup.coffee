Helpers = require '../helpers'
{describe} = Helpers
{forEach} = Helpers

_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'

describe 'Assignment Cleanup', ->

  beforeEach ->
    new Helpers.User(@).login(TEACHER_USERNAME)
    @addTimeout(2)
    new Helpers.CourseSelect(@).goToByType('ANY')

    @calendar = new Helpers.Calendar(@)
    @reading = new Helpers.TaskBuilder(@)
    @calendarPopup = new Helpers.Calendar.Popup(@)

    @calendar.waitUntilLoaded()

  @it 'Deletes all drafts (not really a test but nice cleanup)', ->
    @calendar.el.draftPlan().forEach (plan, index, total) =>
      plan.click()
      @reading.waitUntilLoaded()
      @reading.edit(action: 'DELETE').then ->
        console.log 'Deleted draft', index, '/', total
      @calendar.waitUntilLoaded()

    , (plans) ->
      console.log "Deleting #{plans.length} Drafts..." if plans.length


    # Delete published but not opened plans
    @calendar.el.unopenPlan().forEach (plan, index, total) =>
      @addTimeout(10) # Published plans take a while to delete
      plan.click()
      @calendarPopup.waitUntilLoaded()
      @calendarPopup.goToEdit()
      @reading.edit(action: 'DELETE').then ->
        console.log 'Deleted Unopened', index, '/', total
      @calendar.waitUntilLoaded()

    , (plans) ->
      console.log "Deleting #{plans.length} Unopened..." if plans.length
