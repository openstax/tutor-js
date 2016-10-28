{APIHandler} = require 'shared'

coachAPIHandler = null

updateHeadersWithToken = (token) ->
  coachAPIHandler?.updateXHR(
    headers:
      Authorization: "Bearer #{token}"  
  )

handleFailure = (args...) ->
  # broadcast out error for final error handling by notification modal
  coachAPIHandler?._channel.emit('error', args...)

createHandler = (baseURL, routes, channel) ->
  coachAPIOptions =
    xhr:
      baseURL: baseURL
    # on set.access_token event, set headers with token
    events: [['set.access_token', updateHeadersWithToken]]
    handlers:
      onFail: handleFailure

  coachAPIHandler = new APIHandler(coachAPIOptions, routes, channel)
  coachAPIHandler

module.exports = createHandler