selenium = require 'selenium-webdriver'
_ = require 'underscore'
camelCase = require 'camelcase'
S = require '../../src/helpers/string'

class TestItemHelper
  constructor: (test, testElementLocator) ->
    @_test = test
    @_locator = testElementLocator

  getLocator: (args...) =>
    locator = if _.isFunction(@_locator)
      @_locator(args...)
    else if _.isString(@_locator)
      @test.utils.toLocator(@_locator)
    else
      @_locator

  get: (args...) =>
    locator = @getLocator(args...)
    @test.utils.wait.for(locator)

  getAll: (args...) =>
    locator = @getLocator(args...)
    result = @test.utils.wait.forMultiple(locator)

  isPresent: (args...) =>
    locator = @getLocator(args...)
    @test.driver.isElementPresent(locator).then (isPresent) ->
      isPresent

# Using defined properties for access eliminates the possibility
# of accidental assignment
Object.defineProperties TestItemHelper.prototype,
  test:
    get: -> @_test
  locator:
    get: -> @_locator


class TestHelper extends TestItemHelper
  constructor: (test, testElementLocator, commonElements = {}, options) ->
    defaultOptions =
      loadingLocator:
        css: '.is-loading'
      defaultWaitTime: 1000

    @_options = _.assign {}, defaultOptions, options
    @_el = {}

    super(test, testElementLocator)
    _.each commonElements, @setCommonElement
    @

  waitUntilLoaded: (waitTime = @options.defaultWaitTime) =>
    @test.driver.wait =>
      @test.driver.isElementPresent(@options.loadingLocator).then (isPresent) -> not isPresent
    , waitTime

  setCommonHelper: (name, helper) =>
    @el[name] = helper

    # alias
    # TODO remove completely...this was an anti-pattern and discouraged...even though it was kewll.
    @["get#{S.capitalize(name, false)}"] = helper.get.bind(helper)

  setCommonElement: (locator, name) =>
    @setCommonHelper(name, new TestItemHelper(@test, locator))


# Using defined properties for access eliminates the possibility
# of accidental assignment
Object.defineProperties TestHelper.prototype,
  options:
    get: -> @_options
  el:
    get: -> @_el

module.exports = {TestHelper}
