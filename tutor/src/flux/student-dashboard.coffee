{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{TimeStore} = require './time'
_ = require 'underscore'
moment = require 'moment'

StudentDashboardConfig = {
  _asyncStatusStats: {}

  hide:(taskId) ->
    @_asyncStatusStats[taskId] = 'hiding'

  hidden:(taskId) ->
    @_asyncStatusStats[taskId] = 'hidden'
    @emit("hidden", taskId)

  exports:

    eventsByWeek: (courseId) ->
      data = @_get(courseId)
      tasks = data.tasks or []
      weeks = _.groupBy tasks, (event) ->
        moment(event.due_at).startOf('isoweek').format('YYYYww')
      sorted = {}
      for weekId, events of weeks
        sorted[weekId] = _.sortBy(events, 'due_at')
      sorted

    pastEventsByWeek: (courseId) ->
      weeks = this.exports.eventsByWeek.call(this, courseId)
      thisWeek = moment(TimeStore.getNow()).startOf('isoweek').format('YYYYww')
      _.pick(weeks, (events, week) -> week < thisWeek)

    weeklyEventsForDay: (courseId, day) ->
      events = this.exports.eventsByWeek.call(this, courseId)
      events[moment(day).startOf('isoweek').format('YYYYww')] or []

    canWorkTask: (event) ->
      #students cannot work or view a task if it has been deleted and they haven't started it
      (
        new Date(event.opens_at) < TimeStore.getNow() and
        not (
          event.is_deleted and
          event.complete_exercise_count is 0
        )
      )

    isDeleted: (event) -> event.is_deleted

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
