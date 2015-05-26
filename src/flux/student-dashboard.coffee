{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{TimeStore} = require './time'
_ = require 'underscore'
moment = require 'moment'

arrayToSentence = (arry) ->
  if arry.length > 1
    arry.slice(0, arry.length - 1).join(', ') + ' & ' + arry.slice(-1)
  else
    arry[0]

StudentDashboardConfig = {

  _reset: ->
    CrudConfig.reset.call(this)
    delete @_weeks

  exports:

    eventsByWeek: (courseId) ->
      return @_weeks if @_weeks
      data = @_get(courseId)
      tasks = data.tasks or []
      weeks = _.groupBy tasks, (event) ->
        moment(event.due_at).startOf('isoweek').format('YYYYww')
      sorted = {}
      for weekId, events of weeks
        sorted[weekId] = _.sortBy(events, 'due_at')
      @_weeks = sorted

    pastEventsByWeek: (courseId) ->
      weeks = this.exports.eventsByWeek.call(this, courseId)
      thisWeek = moment(TimeStore.getNow()).startOf('isoweek').format('YYYYww')
      _.pick(weeks, (events, week) -> week < thisWeek)

    weeklyEventsForDay: (courseId, day) ->
      events = this.exports.eventsByWeek.call(this, courseId)
      events[moment(day).startOf('isoweek').format('YYYYww')] or []

    canWorkTask: (event) ->
      # currently all tasks are workable
      return true

    # Returns events who's due date has not passed
    upcomingEvents: (courseId, now = TimeStore.getNow()) ->
      _.chain(@_get(courseId)?.tasks or [])
        .filter( (event) -> new Date(event.due_at) > now )
        .sortBy('due_at')
        .value()

    # Returns events who's due date is in the past
    pastDueEvents: (courseId, now = TimeStore.getNow()) ->
      _.chain(@_get(courseId)?.tasks or [])
        .filter( (event) -> new Date(event.due_at) < now )
        .sortBy('due_at')
        .value()
}

extendConfig(StudentDashboardConfig, new CrudConfig())
{actions, store} = makeSimpleStore(StudentDashboardConfig)
module.exports = {StudentDashboardActions:actions, StudentDashboardStore:store}
