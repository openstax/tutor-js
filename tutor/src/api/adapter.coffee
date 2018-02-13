_ = require 'lodash'
{APIHandler} = require 'shared'
{APIActionAdapter} = require 'shared'
{ observe } = require 'mobx'


{TimeActions} = require '../flux/time'
{AppActions} = require '../flux/app'
User = require('../models/user').default
tutorAPIHandler = null

baseUrl = if window.location.port is '8000' then 'http://localhost:3001/api' else "#{window.location.origin}/api"

setNow = (headers) ->
  # axios will lower case headers https://github.com/axios/axios/issues/413
  date = headers['x-app-date'] or headers['date']
  TimeActions.setFromString(date)

updateHeadersWithToken = (token) ->
  tutorAPIHandler?.updateXHR(
    headers:
      'X-CSRF-Token': token
      token: token
  )

OPTIONS =
  xhr:
    baseURL: baseUrl
    headers:
      'X-CSRF-Token': User.csrf_token
      token: User.csrf_token
  events: [['set.tokens', updateHeadersWithToken]]
  handlers:
    onFail: (error) ->
      {response} = error
      AppActions.setServerError(response or error) unless error?.isRecorded
  hooks:
    handleMalformedRequest: -> # at one time this logged out the user, but that seems too drastic
      null
  isLocal: false

tutorAPIHandler = new APIHandler(OPTIONS)
tutorAPIHandler.channel.on('*.*.*.receive.*', (response) ->
  headers = response.headers or response.response.headers
  setNow(headers)
)

observe(User, 'csrf_token', (change) ->
  tutorAPIHandler.channel.emit('set.tokens', change.newValue) if change.newValue
)

module.exports = _.merge({handler: tutorAPIHandler}, APIActionAdapter(tutorAPIHandler))
