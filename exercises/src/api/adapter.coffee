_ = require 'lodash'
{APIHandler} = require 'shared'
{APIActionAdapter} = require 'shared'

routes = require './routes'

{ErrorsActions} = require '../stores/errors'
CSRF_Token = document.head.querySelector('meta[name=csrf-token]')?.getAttribute("content")

IS_LOCAL = window.location.port is '8001' or window.__karma__

createAPIHandler = ->
  options =
    xhr:
      baseURL: "#{window.location.origin}/api"
      headers:
        'X-CSRF-Token': CSRF_Token
    handlers:
      onFail: (error, args...) ->
        {response} = error
        {status, data, config} = response
        {url} = config
        opts = config

        ErrorsActions.setServerError(status, data, {url, opts})
    isLocal: IS_LOCAL

  new APIHandler(options, routes)

setUpAPIHandler = ->
  exerciseAPIHandler = createAPIHandler()

  _.merge({handler: exerciseAPIHandler}, APIActionAdapter.adaptForHandler(exerciseAPIHandler))

module.exports = {setUpAPIHandler}
