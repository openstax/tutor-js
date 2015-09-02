S = require './string'
_ = require 'underscore'

PeriodHelper =
  getOrder: (period) ->
    S.getNumberAndStringOrder(period.name)

  sort: (periods) ->
    firstSortPeriod = _.chain(periods)
      # puts numbers first
      .sortBy((period) ->
        1 - _.isNumber(period.name)
      )
      # caps should come before non-caps
      .sortBy('name')
      # parse int if possible and sort that as well
      .sortBy(PeriodHelper.getOrder)
      .value()

module.exports = PeriodHelper
