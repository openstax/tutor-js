{APIHandler} = require 'shared'
{APIActionAdapter} = require 'shared'

{Promise} = require 'es6-promise'
_ = require 'lodash'

routes = require './routes'

{TimeActions} = require '../flux/time'
{AppActions} = require '../flux/app'

setNow = (headers) ->
  # X-App-Date with fallback to nginx date
  date = headers['X-App-Date'] or headers['Date']
  TimeActions.setFromString(date)

createAPIHandler = ->
  options =
    xhr:
      baseURL: "#{window.location.origin}/api"
    handlers:
      onFail: (error, args...) ->
        {response} = error
        AppActions.setServerError(response)
    hooks:
      handleMalformedRequest: ->
        CurrentUserActions.logout()
        null

  new APIHandler(options, routes)

setUpAPIHandler = ->
  tutorAPIHandler = createAPIHandler()

  tutorAPIHandler.channel.on('*.*.*.receive.*', (response) ->
    headers = response.headers or response.response.headers
    setNow(headers)
  )
  _.merge({handler: tutorAPIHandler}, APIActionAdapter.adaptForHandler(tutorAPIHandler))

module.exports = {setUpAPIHandler}
