 # Store for getting the current server time.
# Defaults to browser time if a server request has not been made yet.

flux = require 'flux-react'
{ now } = require 'mobx-utils'

{makeSimpleStore} = require './helpers'

TutorDateFormat = "MM/DD/YYYY"

TimeConfig =
  reset: ->
    @_shiftMs = 0

  setNow: (now, localNow = new Date()) ->
    # called by API
    @_shiftMs = now.getTime() - localNow.getTime()

  setFromString: (txtDate, localNow = new Date()) ->
    return unless txtDate
    date = new Date(txtDate)
    if isNaN(date.getTime()) # "Invalid Date"
      console?.warn?("Attempted to set invalid date #{txtDate} on TimeStore")
    else
      @setNow(date, localNow)

  exports:
    getNow: (localNow = new Date(now(60000))) ->
      shift = @_shiftMs or 0
      new Date(localNow.getTime() + shift)

    getFormat: -> TutorDateFormat

{actions, store} = makeSimpleStore(TimeConfig)
module.exports = {TimeActions:actions, TimeStore:store}
