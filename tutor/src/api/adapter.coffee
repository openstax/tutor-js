_ = require 'lodash'
{APIHandler} = require 'shared'
{APIActionAdapter} = require 'shared'

{TimeActions} = require '../flux/time'
{AppActions} = require '../flux/app'
User = require('../models/user').default

IS_LOCAL = window.location.port is '8000' or window.__karma__

setNow = (headers) ->
  # X-App-Date with fallback to nginx date
  date = headers['X-App-Date'] or headers['Date']
  TimeActions.setFromString(date)

OPTIONS =
  xhr:
    baseURL: "#{window.location.origin}/api"
    headers:
      'X-CSRF-Token': User.csrf_token
      token: User.csrf_token
  handlers:
    onFail: (error) ->
      {response} = error
      AppActions.setServerError(response or error)
  hooks:
    handleMalformedRequest: -> # at one time this logged out the user, but that seems too drastic
      null
  isLocal: IS_LOCAL

tutorAPIHandler = new APIHandler(OPTIONS)
tutorAPIHandler.channel.on('*.*.*.receive.*', (response) ->
  headers = response.headers or response.response.headers
  setNow(headers)
)

module.exports = _.merge({handler: tutorAPIHandler}, APIActionAdapter(tutorAPIHandler))
