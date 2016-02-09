# The "current" indentation (nesting) level to print verbose logging
indentationLevel = 0

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
    if process.env.VERBOSE
      console.log("#{indent(indentationLevel)}START: #{msg}")
      indentationLevel++

# Decrement the indentationLevel **BEFORE** printing the END message
_verboseEnd = (test, msg) ->
  test.driver.call ->
    if process.env.VERBOSE
      indentationLevel--
      console.log("#{indent(indentationLevel)}END  : #{msg}")


# Used when a test finishes. Particularly useful when a test fails (so the next test does not start indented)
resetIndentationLevel = ->
  indentationLevel = 0

verbose = (test, arg0, args...) ->
  test.driver.call ->
    if process.env.VERBOSE
      if indentationLevel
        # If the 1st arg is a string then just prepend the indentation level dashes.
        # We do this here so the output is `- - MESSAGE` instead of `'- - ' 'MESSAGE'` (see quotes)
        if typeof arg0 is 'string'
          console.log(indent(indentationLevel) + arg0, args...)
        else
          console.log(indent(indentationLevel), arg0, args...)
      else
        console.log(args...)

# Example: `...utils.verboseWrap('Opening an assignment', () => calendar.openPlan())`
verboseWrap = (test, msg, fn) ->
  throw new Error('BUG: verboseWrap expects a message string as its 1st arg') if typeof msg isnt 'string'
  throw new Error('BUG: verboseWrap expects a function with no args that returns a promise as its 2nd argument') if typeof fn isnt 'function'
  _verboseStart(test, msg)

  promise = fn.apply(test)
  if promise?.then
    # Change `promise` so things output in the correct order
    promise = promise.then (val) ->
      _verboseEnd(test, msg)
      val

  else
    _verboseEnd(test, msg)

  promise

module.exports = {verbose, verboseWrap, resetIndentationLevel}



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
