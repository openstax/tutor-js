minimatch = require 'minimatch'
{Promise} = require 'es6-promise'

partial   = require 'lodash/partial'
merge     = require 'lodash/merge'
extend    = require 'lodash/extend'
includes  = require 'lodash/includes'
some      = require 'lodash/some'
set       = require 'lodash/set'
every     = require 'lodash/every'
isError   = require 'lodash/isError'
isEmpty   = require 'lodash/isEmpty'
propertyOf  = require 'lodash/propertyOf'
isObjectLike = require 'lodash/isObjectLike'

makeLocalRequest = (requestConfig) ->
  {url} = requestConfig

  [uri, params] = url.split('?')
  if requestConfig.method is 'GET'
    url = "#{uri}.json"
  else
    url = "#{uri}/#{requestConfig.method}.json"
    requestConfig.mockMethod = requestConfig.method
    requestConfig.method = 'GET'

  merge(requestConfig, {url, params})
  requestConfig

makeLocalResponse = (response) ->
  payload = if response.config.data then JSON.parse(response.config.data) else {}
  response.data = extend({}, response.data, payload)

doesErrorMatch = (handledErrors, errorName) ->
  includes(handledErrors, errorName) or
    some(handledErrors, partial(minimatch, errorName))

areAllErrorsHandled = (handledErrors, errors, errorNameProperty) ->

  # use set and propertyOf for flexible errorNameProperty -- i.e. can be nested
  errors ?= [set({}, errorNameProperty, 'HTTP_ERROR')]

  every errors, (error) ->
    errorName = propertyOf(error)(errorNameProperty)
    doesErrorMatch(handledErrors, errorName)


class Interceptors
  constructor: (hooks = {}, apiHandler) ->
    @_apiHandler = apiHandler
    @_hooks = hooks
    @

  queRequest: (requestConfig) =>
    @_apiHandler.records.queRequest(requestConfig)
    requestConfig

  makeLocalRequest: (requestConfig) =>
    makeLocalRequest(requestConfig)
    requestConfig

  setResponseReceived: (response) =>
    @_apiHandler.records.recordResponse(response)
    response

  setErrorReceived: (response) =>
    @_apiHandler.records.recordResponse(response)
    Promise.reject(response)

  broadcastSuccess: (response) =>
    {config} = response
    @_apiHandler.channel.emit(config.events.success, response) if config?.events?.success
    response

  broadcastError: (response) =>
    {config} = response
    @_apiHandler.channel.emit(config.events.failure, response) if config?.events?.failure
    Promise.reject(response)

  makeLocalResponse: (response) =>
    makeLocalResponse(response)
    response

  handleNonAPIErrors: (error) =>
    unless error.response
      status = 0
      # TODO, see if error.toString() would be better here.
      statusText = "#{error.name} #{error.message}"
      data = error.stack

      # spoof response error
      error.response = {status, statusText, data}

    Promise.reject(error)

  handleLocalErrors: (error) =>
    {response, config} = error
    {status, statusText} = response
    {method, mockMethod} = config

    mockMethods = ['PUT', 'PATCH']

    # Hack for local testing, fake successful PUT and PATCH
    if status is 404
      response.data = """No mock data found at #{config.url}.
      This error only happens locally."""

    # Hack for local testing. Webserver returns 200 + HTML for 404's
    if statusText is 'parsererror' and status is 200
      response.status = 404
      response.data = 'Error Parsing the JSON or a 404'

    Promise.reject(error)

  handleMalformedRequest: (error) =>
    error = @_hooks.handleMalformedRequest(error) if error.response.status is 400 and @_hooks.handleMalformedRequest?

    Promise.reject(error) if isError(error)

  handleNotFound: (error) =>
    if error.response.status is 404
      error.response.statusText ?= 'ERROR_NOTFOUND'
      error = @_hooks.handleNotFound(error) if @_hooks.handleNotFound?

    Promise.reject(error) if isError(error)

  handleErrorMessage: (error) =>
    {statusText, data} = error.response if isObjectLike(error.response)

    try
      msg = JSON.parse(statusText)
    catch e
      msg = statusText

    error.response.statusMessage = msg

    unless isObjectLike(data)
      try
        error.response.data = JSON.parse(data)
      catch e

    Promise.reject(error)

  filterErrors: (error) =>
    {response, config} = error
    {data} = response if isObjectLike(response)
    return Promise.reject(error) if isEmpty(config)
    if isEmpty(config.handledErrors) or
      not areAllErrorsHandled(config.handledErrors, data?.errors, @_apiHandler.getOptions().errorNameProperty)
        Promise.reject(error)
    else
      response

module.exports = {Interceptors}
