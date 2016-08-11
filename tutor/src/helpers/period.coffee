S = require './string'
_ = require 'underscore'

# Used to filter periods by helper methods
isArchivedCheckFn = (period) -> period.is_archived
isActiveCheckFn   = (period) -> not period.is_archived

PeriodHelper =
  getOrder: (period) ->
    S.getNumberAndStringOrder(period.name)

  sort: (periods) ->
    # expects either numbers, names with numbers or just names
    firstSortPeriod = _.chain(periods)
      # sort names, caps should come before non-caps
      .sortBy((period) ->
        if not _.isNumber(period.name)
          name = period.name.match(/[^0-9]+/ig)
          if name
            name
      )
      # find and sort numbers
      .sortBy((period) ->
        if not _.isNumber(period.name)
          number = period.name.match(/[0-9.-]+/g)
          if number
            parseFloat(number)
        else
          period.name
      )
      .value()

  activePeriods: (course) ->
    _.filter(course.periods, isActiveCheckFn)

  hasPeriods: (course) ->
    not _.isEmpty(@activePeriods(course))

  archivedPeriods: (course) ->
    _.filter(course.periods, isArchivedCheckFn)

module.exports = PeriodHelper
