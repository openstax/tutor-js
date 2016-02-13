selenium = require 'selenium-webdriver'
_ = require 'underscore'
camelCase = require 'camelcase'

S = require '../../src/helpers/string'

class TestItemHelper
  constructor: (test, testElementLocator) ->
    @_test = test
    @_locator = testElementLocator

    # Instrument all the methods of helpers to print using verboseWrap
    # so we can see where Selenium stopped
    _.each _.omit(@, Object.keys(TestItemHelper::), Object.keys(TestHelper::)), (value, key) =>
      # Wrap all functions!
      if typeof value is 'function' and not /^_locator/.test(key) # Exclude the _locator() function because that is used in waitUntil loops
        @[key] = (args...) =>
          @test.utils.verboseWrap("HELPER: #{key}", => value.apply(@, args))

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
    @test.driver.isElementPresent(locator)

  isDisplayed: (args...) =>
    locator = @getLocator(args...)
    el = @findElement(args...)
    el.isDisplayed()

  # Helper for the common case of `get(...).click()`.
  # Plus, it allows a place to add logging since this is one of the most
  # common places for Selenium to time out (trying to click on an element)
  click: (args...) =>
    locator = @getLocator(args...)
    # Scroll to the element so it is visible before clicking (this assumes `position: fixed` is overridden for all element)
    # @isDisplayed(args...).then (isDisplayed) =>
    #   unless isDisplayed
    #     el = @findElement(args...)
    #     @test.utils.windowPosition.scrollTo(el)
    @test.utils.verboseWrap "Clicking #{JSON.stringify(locator)}", =>
      el = @get(args...)
      @test.utils.windowPosition.scrollTo(el)
      el.click()

  waitClick: (args...) =>
    locator = @getLocator(args...)
    @test.utils.wait.for(locator)
    @click(args...)

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
      defaultWaitTime: 40 * 1000 # TODO: Letting tests define their own wait time is dangerous. tutor-dev takes > 10sec to delete a task-plan
      # defaultWaitTime: 20 * 1000 # 20sec seems to be enough for deployed code but not local

    @_options = _.assign {}, defaultOptions, options
    @_el = {}

    commonElements.loadingState = @options.loadingLocator

    _.each commonElements, @setCommonElement
    @

  waitUntilLoaded: () =>
    # Adjust the test timeout *and* tell selenium to wait up to the same amount of time. Maybe this is redundant?
    @test.utils.wait.giveTime @options.defaultWaitTime, =>
      @test.utils.verboseWrap 'Waiting until Loadable .is-loading is gone', => @test.driver.wait(=>
        @el.loadingState.isPresent().then (isPresent) -> not isPresent
      , @options.defaultWaitTime)

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
