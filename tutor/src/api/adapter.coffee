_ = require 'lodash'
{APIHandler} = require 'shared'
{APIActionAdapter} = require 'shared'

routes = require './routes'

{TimeActions} = require '../flux/time'
{AppActions} = require '../flux/app'
{CurrentUserStore} = require '../flux/current-user'

IS_LOCAL = window.location.port is '8000' or window.__karma__

setNow = (headers) ->
  # X-App-Date with fallback to nginx date
  date = headers['X-App-Date'] or headers['Date']
  TimeActions.setFromString(date)

OPTIONS =
  xhr:
    baseURL: "#{window.location.origin}/api"
    headers:
      'X-CSRF-Token': CurrentUserStore.getCSRFToken()
      token: CurrentUserStore.getToken()
  handlers:
    onFail: (error) ->
      {response} = error
      AppActions.setServerError(response)
  hooks:
    handleMalformedRequest: ->
      CurrentUserActions.logout()
      null
  isLocal: IS_LOCAL

createAPIHandler = ->
  new APIHandler(OPTIONS, routes)

setUpAPIHandler = ->
  tutorAPIHandler = createAPIHandler()

  tutorAPIHandler.channel.on('*.*.*.receive.*', (response) ->
    headers = response.headers or response.response.headers
    setNow(headers)
  )
  _.merge({handler: tutorAPIHandler}, APIActionAdapter.adaptForHandler(tutorAPIHandler))

setUp = ->
  tutorAPIHandler = new APIHandler(OPTIONS)

  tutorAPIHandler.channel.on('*.*.*.receive.*', (response) ->
    headers = response.headers or response.response.headers
    setNow(headers)
  )
  _.merge({handler: tutorAPIHandler}, APIActionAdapter.adaptHandler(tutorAPIHandler))

module.exports = {setUpAPIHandler, setUp}
