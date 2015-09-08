{describe, CourseSelect, Calendar, ReadingBuilder} = require '../helpers'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'

describe 'Assignment Cleanup', ->

  @it 'Deletes all drafts (not really a test but nice cleanup)', ->
    @login(TEACHER_USERNAME)
    @addTimeout(2)
    CourseSelect.goTo(@, 'ANY')
    Calendar.verify(@)

    # Since we are deleting we need a special forEach that will not complain when the length changes
    forEach = (css, fn, fn2) =>
      # Need to query multiple times because we might have moved screens so els are stale
      @driver.findElements(css: css).then (els1) =>
        index = 0
        fn2?(els1) # Allow for things like printing "Deleting 20 drafts"
        _.each els1, (el) =>
          @driver.findElement(css: css).then (el) =>
            index += 1
            fn.call(@, el, index, els1.length)

    forEach('.plan:not(.is-published)',
      (plan, index, total) =>
        plan.click()
        ReadingBuilder.edit(@, action: 'DELETE').then ->
          console.log 'Deleted', index, '/', total
        Calendar.verify(@)

    , (plans) ->
      console.log "Deleting #{plans.length} Drafts..." if plans.length
    )

    # Delete published but not opened plans
    forEach('.plan.is-published:not(.is-open)',
      (plan, index, total) =>
        @addTimeout(10) # Published plans take a while to delete
        plan.click()
        Calendar.Popup.goEdit(@)
        ReadingBuilder.edit(@, action: 'DELETE').then ->
          console.log 'Deleted', index, '/', total
        Calendar.verify(@)


    , (plans) ->
      console.log "Deleting #{plans.length} Unopened..." if plans.length
    )
