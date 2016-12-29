Log = require './logging'

originalWindowErrorCallback = window.onerror

onUnhandledPromise = (reason, p) ->
  Log.error("Possibly Unhandled Rejection at: Promise ", p, " reason: #{reason}")

onError = (errorMessage, url, lineNumber, columnNumber, errorObject) ->
  err = errorMessage + ' @ ' + url + ':' + lineNumber + ':' + columnNumber
  if errorObject
    err += "\n" + errorObject.message + "\n" + errorObject.stack

  Log.error(err)

  if typeof originalWindowErrorCallback is 'function'
    originalWindowErrorCallback(errorMessage, url, lineNumber, columnNumber, errorObject)

  return false # explicitly not true, returning true prevents the error from printing on the console



module.exports = {

  isMonitoring: -> @_is_started

  start: ->
    return if @_is_started
    # attach to onerror vs addEventListener for maximum compatibility
    window.onerror = onError

    # this is currently poorly supported (Chrome only), but doesn't hurt to try
    window.addEventListener?('unhandledRejection', onUnhandledPromise)
    @_is_started = true

  stop: ->
    window.onerror = originalWindowErrorCallback
    window.removeEventListener?('unhandledRejection', onUnhandledPromise)

}
