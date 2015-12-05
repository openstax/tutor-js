_ = require 'lodash'
axios = require 'axios'
interpolate = require 'interpolate'

METHODS_WITH_DATA = ['PUT', 'PATCH', 'POST']
LOADING = {}
API_ACCESS_TOKEN = false

defaultFail = (response) ->
  console.info(response)

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

getResponseDataByEnv = (isLocal, eventData, response) ->
  if isLocal
    datasToMerge = [{}, {data: response.data, query: eventData.query}]
    if eventData.change?
      datasToMerge.push(data: eventData.change)
  else
    datasToMerge = [{}, eventData, {data: response.data}]

  _.spread(_.merge)(datasToMerge)


handleAPIEvent = (apiEventChannel, baseUrl, setting, eventData = {}) ->

  isLocal = setting.loadLocally
  # simulate server delay
  delay = if isLocal then 200 else 0

  apiSetting = getAjaxSettingsByEnv(isLocal, baseUrl, setting, eventData)
  if apiSetting.method is 'GET'
    return if LOADING[apiSetting.url]
    LOADING[apiSetting.url] = true

  _.delay ->
    axios(apiSetting)
      .then((response) ->
        delete LOADING[apiSetting.url]
        completedEvent = interpolate(setting.completedEvent, eventData.data)
        completedData = getResponseDataByEnv(isLocal, eventData, response)

        apiEventChannel.emit(completedEvent, completedData)

      ).catch((response) ->
        delete LOADING[apiSetting.url]
        failedData = getResponseDataByEnv(isLocal, eventData, response)
        if _.isString(setting.failedEvent)
          failedEvent = interpolate(setting.failedEvent, eventData.data)
          apiEventChannel.emit(failedEvent, failedData)

        setting.onFail?(response) or defaultFail(response)
        apiEventChannel.emit('error', {response, apiSetting, failedData})
      )
  , delay

loader = (apiEventChannel, settings) ->
  apiEventChannel.on 'set.access_token', (token) ->
    API_ACCESS_TOKEN = token

  _.each settings.endpoints, (setting, eventName) ->
    apiEventChannel.on eventName, _.partial(handleAPIEvent, apiEventChannel, setting.baseUrl or settings.baseUrl, setting)


module.exports = loader
