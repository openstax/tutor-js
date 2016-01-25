selenium = require 'selenium-webdriver'
_ = require 'underscore'
camelCase = require 'camelcase'
S = require '../../src/helpers/string'

class TestItemHelper
  constructor: (test, testElementLocator, name, isSingle = true) ->
    @_name = name
    @_test = test
    @_locator = testElementLocator
    @_isSingle = isSingle

  get: (iter) =>
    waitGet = if @isSingle then 'waitAnd' else 'waitAndMultiple'
    result = @test[waitGet](@test.toLocator(@_locator))

    return result unless iter and not @isSingle

    result.then (elements) ->
      elements[iter]

# Using defined properties for access eliminates the possibility
# of accidental assignment
Object.defineProperties TestItemHelper.prototype,
  test:
    get: -> @_test
  name:
    get: -> @_name
  locator:
    get: -> @_locator
  isSingle:
    get: -> @_isSingle


class TestHelper extends TestItemHelper
  constructor: (test, testElementLocator, commonElements = {}, options) ->
    defaultOptions =
      loadingLocator:
        css: '.is-loading'
      defaultWaitTime: 1000

    @_options = _.assign {}, defaultOptions, options
    @_el = {}

    super(test, testElementLocator, 'parent')
    _.each commonElements, @setCommonElement
    @

  waitUntilLoaded: (waitTime = @options.defaultWaitTime) =>
    @test.driver.wait =>
      @test.driver.isElementPresent(@options.loadingLocator).then (isPresent) -> not isPresent
    , waitTime

  setCommonElement: (commonElementInfo, name) =>
    {locator, isSingle} = commonElementInfo
    @el[name] = new TestItemHelper(@test, locator, name, isSingle)

    # alias
    @["get#{S.capitalize(name, false)}"] = @el[name].get.bind(@[name])


# Using defined properties for access eliminates the possibility
# of accidental assignment
Object.defineProperties TestHelper.prototype,
  options:
    get: -> @_options
  el:
    get: -> @_el

module.exports = {TestHelper}
