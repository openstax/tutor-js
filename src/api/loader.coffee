_ = require 'lodash'
axios = require 'axios'
interpolate = require 'interpolate'

METHODS_WITH_DATA = ['PUT', 'PATCH', 'POST']

API_ACCESS_TOKEN = false

defaultFail = (response) ->
  console.info(response)

getAjaxSettingsByEnv = (isLocal, baseUrl, setting, eventData) ->

  {data, change} = eventData
  apiSetting = _.pick(setting, 'url', 'method')
  apiSetting.data = change if _.includes(METHODS_WITH_DATA, apiSetting.method)

  if isLocal
    apiSetting.url = "#{interpolate(apiSetting.url, data)}/#{apiSetting.method}.json"
    apiSetting.method = 'GET'
  else
    if API_ACCESS_TOKEN
      apiSetting.transformRequest = axios.defaults.transformRequest.concat( (data, headers) ->
        headers['Authorization'] = "Bearer #{API_ACCESS_TOKEN}"
      )
    else if setting.useCredentials
      apiSetting.withCredentials = true
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
  isLocal = not baseUrl?
  # simulate server delay
  delay = if isLocal then 200 else 0

  apiSetting = getAjaxSettingsByEnv(isLocal, baseUrl, setting, eventData)

  _.delay ->
    axios(apiSetting)
      .then((response) ->

        completedEvent = interpolate(setting.completedEvent, eventData.data)
        completedData = getResponseDataByEnv(isLocal, eventData, response)

        apiEventChannel.emit(completedEvent, completedData)
        Promise.resolve(response)

      ).catch((response) ->

        setting.onFail?(response) or defaultFail(response)
        Promise.reject(response)
      )
  , delay

loader = (apiEventChannel, settings) ->
  apiEventChannel.on 'set.access_token', (token) ->
    API_ACCESS_TOKEN = token

  _.each settings.endpoints, (setting, eventName) ->
    apiEventChannel.on eventName, _.partial(handleAPIEvent, apiEventChannel, settings.baseUrl or setting.baseUrl, setting)


module.exports = loader
