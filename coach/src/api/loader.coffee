_ = require 'underscore'
axios = require 'axios'
deepMerge = require 'lodash/merge'

interpolate = require 'interpolate'

METHODS_WITH_DATA = ['PUT', 'PATCH', 'POST']
LOADING = {}
API_ACCESS_TOKEN = false

defaultFail = (response) ->
  console.info(response) unless window.__karma__

getAjaxSettingsByEnv = (isLocal, baseUrl, setting, eventData) ->

  {data, change} = eventData
  apiSetting = _.pick(setting, 'url', 'method')

  if _.includes(METHODS_WITH_DATA, apiSetting.method)
    apiSetting.data = change or data

  if isLocal
    apiSetting.url = "#{interpolate(apiSetting.url, data)}/#{apiSetting.method}.json"
    apiSetting.method = 'GET'
  else
    if setting.useCredentials
      apiSetting.withCredentials = true
    else if API_ACCESS_TOKEN
      apiSetting.headers =
        Authorization: "Bearer #{API_ACCESS_TOKEN}"
    apiSetting.url = "#{baseUrl}/#{interpolate(apiSetting.url, data)}"

  apiSetting

getResponseDataByEnv = (isLocal, requestEvent, response) ->
  if isLocal
    datasToMerge = [{}, {data: response.data, query: requestEvent.query}]
    if requestEvent.change?
      datasToMerge.push(data: requestEvent.change)
  else
    datasToMerge = [{}, requestEvent, {data: response.data}]
  deepMerge.apply {}, datasToMerge


handleAPIEvent = (apiEventChannel, baseUrl, setting, requestEvent = {}) ->

  isLocal = window.__karma__ or setting.loadLocally
  # simulate server delay
  delay = if isLocal then 20 else 0

  apiSetting = getAjaxSettingsByEnv(isLocal, baseUrl, setting, requestEvent)
  if apiSetting.method is 'GET'
    return if LOADING[apiSetting.url]
    LOADING[apiSetting.url] = true

  sendApiEventComplete = ->
    apiEventChannel.emit('completed')

  _.delay ->
    axios(apiSetting)
      .then((response) ->
        delete LOADING[apiSetting.url]
        try
          completedEvent = interpolate(setting.completedEvent, requestEvent.data)
          completedData = getResponseDataByEnv(isLocal, requestEvent, response)
          apiEventChannel.emit(completedEvent, completedData)
        catch error
          apiEventChannel.emit('error', {apiSetting, response, failedData: completedData, exception: error})

        response
      ).catch(({response}) ->
        delete LOADING[apiSetting.url]

        failedData = getResponseDataByEnv(isLocal, requestEvent, response)
        if _.isString(setting.failedEvent)
          failedEvent = interpolate(setting.failedEvent, requestEvent.data)
          apiEventChannel.emit(failedEvent, failedData)

        defaultFail(response)
        apiEventChannel.emit('error', {response, apiSetting, failedData})

        response
      ).then(sendApiEventComplete, sendApiEventComplete)
  , delay

isPending = ->
  not _.isEmpty(LOADING)

loader = (apiEventChannel, settings) ->
  apiEventChannel.on 'set.access_token', (token) ->
    API_ACCESS_TOKEN = token

  _.each settings.endpoints, (setting, eventName) ->
    apiEventChannel.on eventName, _.partial(handleAPIEvent, apiEventChannel, setting.baseUrl or settings.baseUrl, setting)


module.exports = {loader, isPending}
