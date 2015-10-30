_ = require 'lodash'
axios = require 'axios'
interpolate = require 'interpolate'

METHODS_WITH_DATA = ['PUT', 'PATCH', 'POST']


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
    CSRF_Token = document.head.querySelector('meta[name=csrf-token]')?.getAttribute("content")
    apiSetting.headers =
      'X-CSRF-Token': CSRF_Token
      token: null
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

  _.each settings.endpoints, (setting, eventName) ->
    apiEventChannel.on eventName, _.partial(handleAPIEvent, apiEventChannel, settings.baseUrl, setting)


module.exports = loader