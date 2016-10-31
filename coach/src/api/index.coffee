{APIHandler} = require 'shared'
routes = require './routes'

coachAPIHandler = null

# HACK - WORKAROUND
# MediaBodyView.prototype.initializeConceptCoach calls this multiple times
# (triggered by back-button and most perhaps search)
IS_INITIALIZED = false

updateHeadersWithToken = (token) ->
  coachAPIHandler?.updateXHR(
    headers:
      Authorization: "Bearer #{token}"  
  )

getAPIOptions = (baseURL) ->
  coachAPIOptions =
    xhr:
      baseURL: baseURL
    # on set.access_token event, set headers with token
    events: [['set.access_token', updateHeadersWithToken]]
    handlers:
      onFail: (args...) ->
        # broadcast out error for final error handling by notification modal
        coachAPIHandler?.channel.emit('error', args...)

initialize = (baseUrl) ->
  coachAPIHandler = new APIHandler(getAPIOptions(baseUrl), routes) unless IS_INITIALIZED
  IS_INITIALIZED = true

  # export coach api handler things for each access
  module.exports.isPending = coachAPIHandler.records.isPending
  module.exports.channel = coachAPIHandler.channel

destroy = ->
  coachAPIHandler.destroy()
  IS_INITIALIZED = false

module.exports = {initialize, destroy}
