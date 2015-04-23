{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
moment = require 'moment'

addEvents = (hash, events) ->
   for event in events
     week = hash[ moment(event.due_at).format("YYYYww") ] ||= []
     week.push(event)

StudentDashboardConfig = {

  _reset: ->
    CrudConfig.reset.call(this)
    delete @_weeks

  exports:

    eventsByWeek: (courseId) ->
      return @_weeks if @weeks
      data = @_get(courseId)
      @_weeks = {}
      addEvents(@_weeks, data.tasks) if data.tasks
      addEvents(@_weeks, data.exams) if data.exams
      @_weeks

}

extendConfig(StudentDashboardConfig, new CrudConfig())
{actions, store} = makeSimpleStore(StudentDashboardConfig)
module.exports = {StudentDashboardActions:actions, StudentDashboardStore:store}
