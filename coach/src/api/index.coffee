EventEmitter2 = require 'eventemitter2'

{APIHandler} = require 'shared'
routes = require './routes'
ErrorMonitoring = require 'shared/src/helpers/error-monitoring'

coachAPIHandler = null
channel = new EventEmitter2 wildcard: true, maxListeners: routes.length * 2
isPending = -> false
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
    isLocal: window.__karma__

initialize = (baseUrl) ->
  coachAPIHandler = new APIHandler(getAPIOptions(baseUrl), routes, channel) unless IS_INITIALIZED
  IS_INITIALIZED = true

  # export coach api handler things for each access
  module.exports.isPending = coachAPIHandler.records.isPending
  module.exports.channel = coachAPIHandler.channel
  ErrorMonitoring.start()

  coachAPIHandler

destroy = ->
  coachAPIHandler.destroy()
  ErrorMonitoring.stop()
  IS_INITIALIZED = false

module.exports = {initialize, destroy, channel, isPending}
