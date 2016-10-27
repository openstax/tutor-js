{APIHandler} = require 'shared'

coachAPIHandler = null

updateHeadersWithToken = (token) ->
  coachAPIHandler?.updateXHR({
    headers: Authorization: "Bearer #{token}"  
  })

createHandler = (baseURL, routes) ->
  coachAPIOptions =
    xhr:
      baseURL: baseURL
    events: [['set.access_token', updateHeadersWithToken]]

  coachAPIHandler = new APIHandler(coachAPIOptions, routes)
  coachAPIHandler

module.exports = createHandler