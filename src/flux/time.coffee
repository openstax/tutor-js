# Store for getting the current server time.
# Defaults to browser time if a server request has not been made yet.

flux = require 'flux-react'

{makeSimpleStore} = require './helpers'

TimeConfig =

  setNow: (now, localNow = new Date()) ->
    # called by API
    @_shiftMs = now.getTime() - localNow.getTime()

  exports:
    getNow: (localNow = new Date()) ->
      shift = @_shiftMs or 0
      new Date(localNow.getTime() + shift)

{actions, store} = makeSimpleStore(TimeConfig)
module.exports = {TimeActions:actions, TimeStore:store}
