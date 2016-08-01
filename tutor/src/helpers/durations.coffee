moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'
{TimeStore} = require '../flux/time'

module.exports =
  create: (startTime, endTime) ->
    moment(startTime).twix(endTime)

  isPastDue: ({due_at}) ->
    moment(TimeStore.getNow()).isAfter(due_at)
