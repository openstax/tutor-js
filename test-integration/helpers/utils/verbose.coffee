verbose = (test, args...) ->
  test.driver.call ->
    if process.env.VERBOSE
      console.log(args...)

# Example: `...utils.verboseWrap('Opening an assignment', () => calendar.openPlan())`
verboseWrap = (test, msg, fn) ->
  throw new Error('BUG: verboseWrap expects a function with no args that returns a promise') if typeof fn isnt 'function'
  verbose(test, "START: #{msg}")
  promise = fn.apply(test)
  promise.then ->
    verbose(test, "END  : #{msg}")
  promise

module.exports = {verbose, verboseWrap}



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
