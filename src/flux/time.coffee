# Store for getting the current server time.
# Defaults to browser time if a server request has not been made yet.

flux = require 'flux-react'

{makeSimpleStore} = require './helpers'

TimeConfig =

  setNow: (now) ->
    # called by API
    localNow = new Date()
    @_shiftMs = now.getTime() - localNow.getTime()

  exports:
    getNow: ->
      shift = @_shiftMs or 0
      localNow = new Date()
      new Date(localNow.getTime() + shift)

{actions, store} = makeSimpleStore(TimeConfig)
module.exports = {TimeActions:actions, TimeStore:store}
