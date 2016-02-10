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
    @test.utils.wait.forMultiple(locator)

  findElement: (args...) =>
    locator = @getLocator(args...)
    @test.driver.findElement(locator)

  findElements: (args...) =>
    locator = @getLocator(args...)
    @test.driver.findElements(locator)


  forEach: (args..., forEachFunction, forEachFunction2) =>
    locator = @getLocator(args...)
    @test.utils.forEach(locator, forEachFunction, forEachFunction2)

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
  element:
    get: -> @get()


class TestHelper extends TestItemHelper
  constructor: (test, testElementLocator, commonElements, options) ->
    super(test, testElementLocator)
    commonElements ||= _.result(@, 'elementRefs', {})
    defaultOptions =
      loadingLocator:
        css: '.is-loading'
      defaultWaitTime: 1000

    @_options = _.assign {}, defaultOptions, options
    @_el = {}

    commonElements.loadingState = @options.loadingLocator

    _.each commonElements, @setCommonElement
    @

  waitUntilLoaded: (waitTime = @options.defaultWaitTime) =>
    @test.driver.wait =>
      @el.loadingState.isPresent().then (isPresent) -> not isPresent
    , waitTime

  setCommonHelper: (name, helper) =>
    @el[name] = helper

  setCommonElement: (locator, name) =>
    @setCommonHelper(name, new TestItemHelper(@test, locator))


# Using defined properties for access eliminates the possibility
# of accidental assignment
Object.defineProperties TestHelper.prototype,
  options:
    get: -> @_options
  el:
    get: -> @_el

module.exports = {TestHelper, TestItemHelper}
