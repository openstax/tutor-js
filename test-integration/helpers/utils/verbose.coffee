# The "current" indentation (nesting) level to print verbose logging
indentationLevel = 0
currentLog = []

# Used when a test finishes. Particularly useful when a test fails (so the next test does not start indented)
reset = ->
  indentationLevel = 0
  currentLog = []

getLog = ->
  currentLog

_isEnabled = process.env.VERBOSE and JSON.parse(process.env.VERBOSE) # Just parse once
isEnabled = -> _isEnabled

log = (test, args...) ->
  msLeft = (test.timeout.__START_TIME + test.timeout.__ORIGINAL.call(test)) - Date.now()
  secsLeft = Math.floor(msLeft / 1000)
  # if secsLeft < 10
  #   if secsLeft >= 0
  #     secsLeft = "0#{secsLeft}"
  secs = "[#{secsLeft}s]"
  if isEnabled()
    console.log(secs, args...)
  currentLog.push([secs].concat(args))



# Indent the log files depending on what the level is
indent = (level) ->
  str = [];
  if level
    for i in [0...level]
      str.push('- ')
    str.join('')
  else
    ''

# Increment the indentationLevel **AFTER** printing a START message
_verboseStart = (test, msg) ->
  test.driver.call ->
    log(test, "#{indent(indentationLevel)}START: #{msg}")
    indentationLevel++

toString = (val) ->
  if val
    if val.then
      retType = 'Promise'
    else if typeof val is 'function'
      if val.name
        retType = val.name
      else
        retType = '[function]'
    else if val.constructor
      try
        retType = JSON.stringify(val)
      catch
        retType = val.constructor.name or val.constructor.toString()
    else
      try
        retType = JSON.stringify(val)
      catch
        retType = val
  else
    retType = 'falsy'
  retType

# Decrement the indentationLevel **BEFORE** printing the END message
_verboseEnd = (test, msg, val) ->
  retType = toString(val)
  test.driver.call ->
    indentationLevel--
    log(test, "#{indent(indentationLevel)}END  : #{msg} returning=#{retType}")


verbose = (test, arg0, args...) ->
  test.driver.call ->
    if indentationLevel
      # If the 1st arg is a string then just prepend the indentation level dashes.
      # We do this here so the output is `- - MESSAGE` instead of `'- - ' 'MESSAGE'` (see quotes)
      if typeof arg0 is 'string'
        log(test, indent(indentationLevel) + arg0, args...)
      else
        log(test, indent(indentationLevel), arg0, args...)
    else
      log(test, args...)

# Example: `...utils.verboseWrap('Opening an assignment', () => calendar.openPlan())`
verboseWrap = (test, msg, fn) ->
  throw new Error('BUG: verboseWrap expects a message string as its 1st arg') if typeof msg isnt 'string'
  throw new Error('BUG: verboseWrap expects a function with no args that returns a promise as its 2nd argument') if typeof fn isnt 'function'

  _verboseStart(test, msg)

  promise = fn.apply(test)
  if promise?.then
    # Change `promise` so things output in the correct order
    promise = promise.then (val) ->
      _verboseEnd(test, msg, val)
      val

  else
    _verboseEnd(test, msg, promise)

  promise

module.exports = {verbose, verboseWrap, reset, getLog, isEnabled}



# selenium = require 'selenium-webdriver'
# debug = (args...) ->
#   if process.env.VERBOSE
#     console.log(args...)
#
# selenium_WebElement__click = selenium.WebElement::click
# selenium.WebElement::click = (args...) ->
#   locator = @__locator
#   debug('Clicking', locator, args...)
#   ret = selenium_WebElement__click.apply(@, args)
#   if ret.then
#     ret.then ->
#       debug('Clicked!', locator, args...)
#
#
# selenium_WebDriver__findElement = selenium.WebDriver::findElement
# selenium.WebDriver::findElement = (locator) ->
#   debug('Finding', locator)
#   ret = selenium_WebDriver__findElement.apply(@, [locator])
#   ret.__locator = locator
#   ret
