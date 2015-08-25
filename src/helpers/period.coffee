_ = require 'underscore'

PeriodHelper =
  getOrder: (period) ->
    parseInt(period.name)

module.exports = PeriodHelper
