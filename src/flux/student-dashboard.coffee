{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{TimeStore} = require './time'
_ = require 'underscore'
moment = require 'moment'

addEvents = (hash, events) ->
  for event in events
    week = hash[ moment(event.due_at).startOf('isoweek').format('YYYYww') ] ||= []
    week.push(event)

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
      return @_weeks if @weeks
      data = @_get(courseId)
      @_weeks = {}
      addEvents(@_weeks, data.tasks) if data.tasks
      addEvents(@_weeks, data.exams) if data.exams
      @_weeks

    pastEventsByWeek: (courseId) ->
      weeks = this.exports.eventsByWeek.call(this, courseId)
      thisWeek = moment(TimeStore.getNow()).startOf('isoweek').format('YYYYww')
      _.pick(weeks, (events, week) -> week < thisWeek)

    weeklyEventsForDay: (courseId, day) ->
      events = this.exports.eventsByWeek.call(this, courseId)
      events[moment(day).startOf('isoweek').format('YYYYww')] or []

    getTitles: (courseId) ->
      data = @_get(courseId)
      shortTitle = data.course.name.split(' ')[0]
      longTitle = "#{data.course.name} | #{arrayToSentence(data.course.teacher_names)}"
      {longTitle, shortTitle}

    canWorkTask: (event) ->
      # only homework and readings can be worked on
      _.contains(['homework', 'reading'], event.type) and
        # readings can always be performed
        (event.type is 'reading' or
            # other types (homework) must be incomplete and not past due
            (not event.complete and moment(event.due_at).isAfter(TimeStore.getNow())))

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
