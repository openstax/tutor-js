{describe, CourseSelect, forEach, Calendar, User, ReadingBuilder} = require '../helpers'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'

describe 'Assignment Cleanup', ->

  beforeEach ->
    new User(@, TEACHER_USERNAME).login()
    @addTimeout(2)
    new CourseSelect(@).goTo('ANY')
    Calendar.verify(@)

  @it 'Deletes all drafts (not really a test but nice cleanup)', ->
    @utils.forEach(css: '.plan:not(.is-published)', ignoreLengthChange: true,
      (plan, index, total) =>
        plan.click()
        new ReadingBuilder(@).edit(action: 'DELETE').then ->
          console.log 'Deleted', index, '/', total
        Calendar.verify(@)

    , (plans) ->
      console.log "Deleting #{plans.length} Drafts..." if plans.length
    )

    # Delete published but not opened plans
    @utils.forEach(css: '.plan.is-published:not(.is-open)', ignoreLengthChange: true,
      (plan, index, total) =>
        @addTimeout(10) # Published plans take a while to delete
        plan.click()
        Calendar.Popup.goEdit(@)
        new ReadingBuilder(@).edit(action: 'DELETE').then ->
          console.log 'Deleted', index, '/', total
        Calendar.verify(@)


    , (plans) ->
      console.log "Deleting #{plans.length} Unopened..." if plans.length
    )
