moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'


durations =
  create: (startTime, endTime) ->
    moment(startTime).twix(endTime)
