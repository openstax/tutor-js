_ = require 'lodash'
axios = require 'axios'
interpolate = require 'interpolate'

{ccEvents} = require '../events'

METHODS_WITH_DATA = ['PUT', 'PATCH', 'POST']



defaultFail = (response) ->
  console.info(response)

handleAPIEvent = (baseUrl, setting, eventData = {}) ->
  {data, change} = eventData

  apiSetting = _.pick(setting, 'url', 'method')
  apiSetting.data = change if _.includes(METHODS_WITH_DATA, apiSetting.method)

  if baseUrl?
    CSRF_Token = document.head.querySelector('meta[name=csrf-token]')?.getAttribute("content")
    apiSetting.headers =
      'X-CSRF-Token': CSRF_Token
      token: null
    apiSetting.url = "#{baseUrl}/#{interpolate(apiSetting.url, data)}"
  else
    apiSetting.url = "#{interpolate(apiSetting.url, data)}/#{apiSetting.method}.json"
    apiSetting.method = 'GET'

  completedEvent = interpolate(setting.completedEvent, data)

  axios(apiSetting)
    .then((response) ->

      if baseUrl?
        datasToMerge = [{}, eventData, {data: response.data}]
      else
        datasToMerge = [{}, {data: response.data}]
        if eventData.change?
          datasToMerge.push(data: eventData.change)

      completedData = _.spread(_.merge)(datasToMerge)
      ccEvents.emit(completedEvent, completedData)

      Promise.resolve(response)

    ).catch((response) ->

      setting.onFail?(response) or defaultFail(response)

      Promise.reject(response)
    )

loadAPISettings = (settings) ->

  _.each settings.endpoints, (setting, eventName) ->
    ccEvents.on eventName, _.partial(handleAPIEvent, settings.baseUrl, setting)


module.exports = {loadAPISettings}