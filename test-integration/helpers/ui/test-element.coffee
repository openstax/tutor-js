selenium = require 'selenium-webdriver'
_ = require 'underscore'
camelCase = require 'camelcase'
S = require '../../../src/helpers/string'
{curry} = require 'lodash'


DEFAULT_ELEMENTS =
  loadingState:
    css: '.is-loading'

###
Wraps the locator of an element item accessible by specs and exposes convenient functions on the matching element(s)
###
class TestItemHelper
  ###
  @param {Object} test The full context of the test element is being instantiated in
  @param {Object|Function|String} testElementLocator Selenium locator object, or a function that returns a locator object based on parameters. If a string is provided, the locator is assumed to be a css locator.
  @param {Object} [options] Extra options, `onBeforeMethodCall` can be set.
  ###
  constructor: (test, testElementLocator, options = {}) ->
    throw new Error('BUG: Missing the current test!') unless test
    throw new Error('BUG: Missing locator') unless testElementLocator

    @test = test
    @locator = testElementLocator

    # Instrument all the methods of helpers to print using verboseWrap
    # so we can see where Selenium stopped
    _.each _.omit(@, Object.keys(TestItemHelper::), Object.keys(TestHelper::)), (value, key) =>
      # Wrap all functions!
      if _.isFunction(value) and not /^_locator/.test(key) # Exclude the _locator() function because that is used in waitUntil loops
        @[key] = (args...) =>
          @test.utils.verboseWrap("HELPER: #{key}", => value.apply(@, args))

    @fn = wrapHelperToFunction(@, options, _.keys(TestItemHelper::))

    @

  ###
  Takes the internally set `locator` and returns the corresponding valid Selenium selector.

  Can take arguments to pass into `locator` if `locator` is parameter dependent.

  @param {Any} [args...] Any number of parameters for `locator` to use if `locator` is a function dependent on parameters.
  @returns {Selenium.Locator}
  ###
  getLocator: (args...) =>
    locator = if _.isFunction(@locator)
      @locator(args...)
    else if _.isString(@locator)
      @test.utils.toLocator(@locator)
    else
      @locator

  ###
  Helps pass through custom wait time to `get`, `getAll`, and `waitClick` if provided.
  *Intended for internal use*, but exposed for extensibility if need.

  @param {Function} waitFunction The wait function to wrap.
  @param {Any} [args...] Any number of parameters for `locator` to use if `locator` is a function dependent on parameters.
  @param {Number} [waitMs] The last parameter, if provided and is a number.
  @returns {Function}
  ###
  aliasWait: (waitFunction, args...) =>
    locator = @getLocator(args...)

    lastArg = _.last(args)
    waitTime = if _.isNumber(lastArg) then lastArg else null

    if _.isNumber(lastArg)
      waitTime = lastArg
      lastArg = null
    else if _.isNumber(args[args.length - 2])
      waitTime = args[args.length - 2]
    else
      waitTime = null

    waitFunction(locator, waitTime, lastArg)

  ###
  Waits until element is visible before trying to return the Selenium.Promise of the matching Selenium.WebElement
  This will only wait until waitMs (default `60000`).

  @param {Any} [args...] Any number of parameters for `locator` to use if `locator` is a function dependent on parameters.
  @param {Number} [waitMs] The last parameter, if provided and is a number.
  @returns {Selenium.Promise}
  ###
  get: (args...) =>
    @aliasWait(@test.utils.wait.for, args...)

  ###
  Waits until an element is visible before trying to return the Selenium.Promise of Array of matching Selenium.WebElements
  This will only wait until waitMs (default `60000`).

  @param {Any} [args...] Any number of parameters for `locator` to use if `locator` is a function dependent on parameters.
  @param {Number} [waitMs] The last parameter, if provided and is a number.
  @returns {Selenium.Promise}
  ###
  getAll: (args...) =>
    @aliasWait(@test.utils.wait.forMultiple, args...)

  ###
  Waits until an element is visible on passed in element before trying to return the Selenium.Promise of Array of
  matching Selenium.WebElements

  This will only wait until waitMs (default `60000`).

  @param {Any} [args...] Any number of parameters for `locator` to use if `locator` is a function dependent on parameters.
  @param {Number} [waitMs] The last parameter, if provided and is a number.
  @param {SeleniumWebElement} Selenium Web element object to find `locator` on
  @returns {Selenium.Promise}
  ###
  getOn: (args...) =>
    @aliasWait(@test.utils.wait.forOn, args...)

  ###
  Helper for the common case of `wait.for(...).click()`.

  Plus, it allows a place to add logging since this is one of the most common places for Selenium to time out (trying to click on an element)

  This will only wait until waitMs (default `60000`).

  @param {Any} [args...] Any number of parameters for `locator` to use if `locator` is a function dependent on parameters.
  @param {Number} [waitMs] The last parameter, if provided and is a number.
  @returns {Selenium.Promise}
  ###
  waitClick: (args...) =>
    @aliasWait(@test.utils.wait.click, args...)

  ###
  Tries to find and return Selenium.Promise of Selenium.WebElement immediately

  @param {Any} [args...] Any number of parameters for `locator` to use if `locator` is a function dependent on parameters.
  @returns {Selenium.Promise}
  ###
  findElement: (args...) =>
    locator = @getLocator(args...)
    @test.driver.findElement(locator)

  ###
  Tries to find and return Selenium.Promise of array of matching Selenium.WebElement immediately

  @param {Any} [args...] Any number of parameters for `locator` to use if `locator` is a function dependent on parameters.
  @returns {Selenium.Promise}
  ###
  findElements: (args...) =>
    locator = @getLocator(args...)
    @test.driver.findElements(locator)


  ###
  Tries to find and return Selenium.Promise of Selenium.WebElement immediately on the Selenium element that gets passed in

  @param {Any} [args...] Any number of parameters for `locator` to use if `locator` is a function dependent on parameters.
  @param {SeleniumWebElement} Selenium Web element object to find `locator` on
  @returns {Selenium.Promise}
  ###
  findOn: (args...) =>
    locator = @getLocator(args...)

    element = _.last(args)

    # need to throw error unless element.findElement?

    element.findElement?(locator)

  ###
  Tries to find and click immediately

  @param {Any} [args...] Any number of parameters for `locator` to use if `locator` is a function dependent on parameters.
  @returns {Selenium.Promise}
  ###
  click: (args...) =>
    @findElement(args...).click()

  ###
  Checks if element matching locator is immediately present, returns Selenium.Promise that resolves to a boolean

  @param {Any} [args...] Any number of parameters for `locator` to use if `locator` is a function dependent on parameters.
  @param {Function} forEachFunction The last parameter, if provided and is a function, will be run on each WebElement
  @param {Function} [forEachFunction2] If an additional function is available, this will run once before.
  ###
  forEach: (args...) =>
    [argsForEach, argsForLocator] = _.partition(args, _.isFunction)
    locator = @getLocator(argsForLocator...)
    options = _.defaults({}, locator, argsForLocator...)
    argsForEach.unshift(options)

    @test.utils.forEach(argsForEach...)

  ###
  Checks if element matching locator is currently present, returns Selenium.Promise that resolves to a boolean

  @param {Any} [args...] Any number of parameters for `locator` to use if `locator` is a function dependent on parameters.
  @returns {Selenium.Promise}
  ###
  isPresent: (args...) =>
    locator = @getLocator(args...)
    @test.driver.isElementPresent(locator)

  ###
  Checks if element matching locator is currently displayed, returns Selenium.Promise that resolves to a boolean

  @param {Any} [args...] Any number of parameters for `locator` to use if `locator` is a function dependent on parameters.
  @returns {Selenium.Promise}
  ###
  isDisplayed: (args...) =>
    @isPresent(args...).then (isPresent) =>
      if isPresent
        locator = @getLocator(args...)
        el = @findElement(args...)
        el.isDisplayed()
      else
        false

  ###
  Tries to find the immediate parent of the element matching the locator, returns Selenium.Promise of Selenium.WebElement

  @param {Any} [args...] Any number of parameters for `locator` to use if `locator` is a function dependent on parameters.
  @returns {Selenium.Promise}
  ###
  getParent: (args...) =>
    locator = @getLocator(args...)
    @test.utils.dom.getParent(locator)

###
A collection of convenience methods for a test component.  Usually extended with additional helper methods before instantiation.

[How to extend](https://github.com/openstax/tutor-js/tree/master/test-integration/helpers/ui)

@property {Object} el Exposes instances of `TestItemHelper` of common test elements on this component.
###
class TestHelper
  ###
  @param {Object} test The full context of the test element is being instantiated in
  @param {Object|Function|String} testElementLocator Selenium locator object, or a function that returns a locator object based on parameters. If a string is provided, the locator is assumed to be a css locator.
  @param {Object} commonElements An Object where the `name` of `locator`s are the keys, and the locators are the values.
  @param {Object} [options] Extra options, `defaultWaitTime` can be set.
  ###
  constructor: (test, testElementLocator, commonElements, options) ->
    commonElements ||= _.result(@, 'elementRefs', {})
    commonElements = _.extend({}, DEFAULT_ELEMENTS, commonElements)

    defaultOptions =
      defaultWaitTime: 40 * 1000 # TODO: Letting tests define their own wait time is dangerous. tutor-dev takes > 10sec to delete a task-plan

    @test = test
    @_options = _.assign {}, defaultOptions, options
    @_el = {}

    commonElements.self = testElementLocator

    _.each commonElements, @setCommonElement
    @

  ###
  Wait until component is loaded before beginning tests.  Defaults to waiting for `css: '.is-loading'` to be not present.

  The locator to wait for can be set in `commonElements` during instantiation as `loadingState`.

  @returns {Selenium.Promise}
  ###
  waitUntilLoaded: =>
    @test.utils.wait.giveTime @options.defaultWaitTime, =>
      @test.utils.wait.until "Waiting until Loadable #{JSON.stringify(@el.loadingState().getLocator())} is gone", =>
        @el.loadingState().isPresent().then (isPresent) -> not isPresent

    @validate()

  ###
  Check whether base/parent element for test is present.

  @returns {Selenium.Promise}
  ###
  validate: =>
    @el.self().get()

  ###
  Set item helper as a function that takes arguments for the locator on `el`.

  @param {String} name The name the `el` will be accessed by.
  @param {TestItemHelper|TestHelper} helper Usually a `TestItemHelper` that is exposed on `el`.
  ###
  setCommonHelper: (name, helper) =>
    @el[name] = helper.fn or helper

  ###
  Takes `commonElements` from instantiation and wraps the `locator` with `TestItemHelper` methods

  @private

  @param {Object|Function|String} locator Selenium locator object, or a function that returns a locator object based on parameters. If a string is provided, the locator is assumed to be a css locator.
  @param {String} name The name the `el` will be accessed by.
  ###
  setCommonElement: (locator, name) =>
    @setCommonHelper(name, new TestItemHelper(@test, locator,
      onBeforeMethodCall: (methodName, args...) ->
        console.log "Deprecated call to el.#{name}.#{methodName}(...). Use el.#{name}(...).#{methodName}() instead"
    ))

###
@ignore
###
wrapHelperToFunction = (helper, options, methodNames) ->

  helperFunction = (args...) ->
    wrappedMethods = {}

    # For each method, pass on args from helper function to method
    _.each methodNames, (methodName) ->
      if _.isFunction helper[methodName]
        # allows methods to be called like this:
        # el.itemName(optionLocatorParams).get(getParams) -- where getParams would likely be waitTime
        wrappedMethods[methodName] = _.partial curry(helper[methodName]), args...

    # The helper function returns a fresh copy of
    # the helper extended with the wrapped methods.
    _.extend({}, helper, wrappedMethods)

  # expose each method on the function as well
  _.each methodNames, (methodName) ->
    helperFunction[methodName] = (args...) ->
      options.onBeforeMethodCall?(methodName, args...)
      helper[methodName](args...)

  helperFunction


###
@ignore
Using defined properties for access eliminates the possibility
of accidental assignment
###
Object.defineProperties TestHelper.prototype,
  options:
    get: -> @_options
  el:
    get: -> @_el

module.exports = {TestHelper, TestItemHelper}
