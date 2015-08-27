_ = require 'underscore'

PeriodHelper =
  getOrder: (period) ->
    parseInt(period.name) or period.name

module.exports = PeriodHelper
