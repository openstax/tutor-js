{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{TimeStore} = require './time'
_ = require 'underscore'
moment = require 'moment'

addEvents = (hash, events) ->
  for event in events
    week = hash[ moment(event.due_at).startOf('isoweek').format("YYYYww") ] ||= []
    week.push(event)

arrayToSentence = (arry) ->
  arry.slice(0, arry.length - 1).join(', ') + " & " + arry.slice(-1)

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

    weeklyEventsForDay: (courseId, day) ->
      events = this.exports.eventsByWeek.call(this, courseId)
      events[moment(day).startOf('isoweek').format("YYYYww")] or []

    getTitles: (courseId) ->
      data = @_get(courseId)
      shortTitle = data.course.name.split(' ')[0]
      longTitle = "#{data.course.name} | #{arrayToSentence(data.course.teacher_names)}"
      {longTitle, shortTitle}

    # Return a few events that are past due
    # Options:
    #   limit: How many records to return, defaults to 4
    #   startAt: Events older than this will be returned, default to TimeStore.getNow()
    pastDueEvents: (courseId, options = {}) ->
      _.defaults options,
        limit: 4
        startAt: TimeStore.getNow()

      _.chain(@_get(courseId)?.tasks or [])
        .filter( (event) ->
          new Date(event.due_at) < options.startAt
        )
        .sortBy('due_at')
        .last(options.limit)
        .value()
}

extendConfig(StudentDashboardConfig, new CrudConfig())
{actions, store} = makeSimpleStore(StudentDashboardConfig)
module.exports = {StudentDashboardActions:actions, StudentDashboardStore:store}
