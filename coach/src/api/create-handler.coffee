{APIHandler} = require 'shared'

coachAPIHandler = null

updateHeadersWithToken = (token) ->
  coachAPIHandler?.updateXHR(
    headers:
      Authorization: "Bearer #{token}"  
  )

createHandler = (baseURL, routes, channel) ->
  coachAPIOptions =
    xhr:
      baseURL: baseURL
    # on set.access_token event, set headers with token
    events: [['set.access_token', updateHeadersWithToken]]

  coachAPIHandler = new APIHandler(coachAPIOptions, routes, channel)
  coachAPIHandler

module.exports = createHandler