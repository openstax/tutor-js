_ = require 'lodash'
$ = require 'jquery'
interpolate = require 'interpolate'

METHODS_WITH_DATA = ['PUT', 'PATCH', 'POST']
LOADING = {}
API_ACCESS_TOKEN = false

defaultFail = (response) ->
  console.info(response)

getAjaxSettingsByEnv = (isLocal, baseUrl, setting, eventData) ->

  {data, change} = eventData
  apiSetting = _.pick(setting, 'url', 'method')
  apiSetting.dataType = 'json'
  apiSetting.contentType = 'application/json;charset=UTF-8'

  if _.includes(METHODS_WITH_DATA, apiSetting.method)
    apiSetting.data = JSON.stringify(change or data)

  if isLocal
    apiSetting.url = "#{interpolate(apiSetting.url, data)}/#{apiSetting.method}.json"
    apiSetting.method = 'GET'
  else
    if setting.useCredentials
      apiSetting.xhrFields =
        withCredentials: true
    else if API_ACCESS_TOKEN
      apiSetting.headers =
        Authorization: "Bearer #{API_ACCESS_TOKEN}"
    apiSetting.url = "#{baseUrl}/#{interpolate(apiSetting.url, data)}"

  apiSetting

getResponseDataByEnv = (isLocal, requestEvent, data) ->
  if isLocal
    datasToMerge = [{}, {data, query: requestEvent.query}]
    if requestEvent.change?
      datasToMerge.push(data: requestEvent.change)
  else
    datasToMerge = [{}, requestEvent, {data}]
  _.spread(_.merge)(datasToMerge)


handleAPIEvent = (apiEventChannel, baseUrl, setting, requestEvent = {}) ->

  isLocal = setting.loadLocally
  # simulate server delay
  delay = if isLocal then 200 else 0

  apiSetting = getAjaxSettingsByEnv(isLocal, baseUrl, setting, requestEvent)
  if apiSetting.method is 'GET'
    return if LOADING[apiSetting.url]
    LOADING[apiSetting.url] = true

  _.delay ->
    $.ajax(apiSetting)
      .then((responseData) ->
        delete LOADING[apiSetting.url]
        try
          completedEvent = interpolate(setting.completedEvent, requestEvent.data)
          completedData = getResponseDataByEnv(isLocal, requestEvent, responseData)
          apiEventChannel.emit(completedEvent, completedData)
        catch error
          apiEventChannel.emit('error', {apiSetting, response: responseData, failedData: completedData, exception: error})
      ).fail((response) ->
        delete LOADING[apiSetting.url]

        {responseJSON} = response

        failedData = getResponseDataByEnv(isLocal, requestEvent, responseJSON)
        if _.isString(setting.failedEvent)
          failedEvent = interpolate(setting.failedEvent, requestEvent.data)
          apiEventChannel.emit(failedEvent, failedData)

        defaultFail(response)
        apiEventChannel.emit('error', {response, apiSetting, failedData})
      )
  , delay

loader = (apiEventChannel, settings) ->
  apiEventChannel.on 'set.access_token', (token) ->
    API_ACCESS_TOKEN = token

  _.each settings.endpoints, (setting, eventName) ->
    apiEventChannel.on eventName, _.partial(handleAPIEvent, apiEventChannel, setting.baseUrl or settings.baseUrl, setting)


module.exports = loader
