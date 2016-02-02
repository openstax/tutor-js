
# Overview

To help with writing Selenium tests, we have two types of helpers --
  * **utils**
    * UI agnostic
    * helps with things like
      * getting elements synchronously
      * resizing windows
      * taking screenshots...
  * **UI helpers**
    * attaches commonly useful util methods on common UI elements
    * extend the base `TestHelper` in `./test-element.coffee`

# Writing a new UI helper

UI helpers should be in this folder.

1. Include the needed libraries
  ```coffee
  selenium = require 'selenium-webdriver'
  {TestHelper} = require './test-element'
  ```
2. Declare the common elements your will need to access in an object where properties are the common element's name, and the values are the locator objects, or a function that returns a locator object based on parameters
  ```coffee
  COMMON_ELEMENTS =
    forecastLink:
      linkText: 'Performance Forecast'
    studentScoresLink:
      linkText: 'Student Scores'
    addToggle:
      css: '.add-assignment .dropdown-toggle'
    planByTitle: (title) ->
      css: ".plan label[data-title='#{title}']"
  ```
3. Create a new helper class that extends `TestHelper` and provide default options to the base constructor
  ```coffee
  class CalendarHelper extends TestHelper
    constructor: (testContext, testElementLocator) ->

      # the locator of the base UI
      testElementLocator ?=
        css: '.calendar-container'
      # Options for this helper.
      # The calendar has a custom loading indicator (not `.is-loading`), and often takes longer than the default wait to load time of 1000ms.
      calendarOptions =
        loadingLocator:
          css: '.calendar-loading'
        defaultWaitTime: 3000

      # instantiate with options by calling the base `TestHelper`'s constructor
      super(testContext, testElementLocator, COMMON_ELEMENTS, calendarOptions)
      # Not commonly needed.
      # For this particular UI, a planPopup and methods controlling the popup are helpful to separate from the main parent calendar UI helper methods.
      # PlanPopupHelper is an extended TestHelper like CalendarHelper is.
      @setCommonHelper('planPopup', new PlanPopupHelper(@test))
  ```
  From doing the above, if we instantiate CalendarHelper, we get back something that looks like this:
  ```coffee
  calendarHelper =
    test: testContext
    options: calendarOptions
    el:
      # from the COMMON_ELEMENTS
      forecastLink: <TestItemHelper>
      studentScoresLink: <TestItemHelper>
      addToggle: <TestItemHelper>
      planByTitle: <TestItemHelper>

      # uses the loadingLocator option
      loadingState: <TestItemHelper>

      # from explicitly calling setCommonHelper
      planPopup: <PlanPopupHelper>

    # This function will force all selenium based promises to wait for the loading element to be absent before continuing.
    waitUntilLoaded: (waitTime = @options.defaultWaitTime) =>
      @test.driver.wait =>
        @el.loadingState.isPresent().then (isPresent) -> not isPresent
      , waitTime

    # The following are used to attach the helpers that are now on CalendarHelper.el.  They are exposed here for customizing your helper as needed, as in this case with the planPopup, but should not be overused.
    setCommonHelper: (name, helper) =>
      @el[name] = helper
    setCommonElement: (locator, name) =>
      @setCommonHelper(name, new TestItemHelper(@test, locator))
  ```
  Note that TestHelper itself is extended from `TestItemHelper`, meaning CalendarHelper and the items on CalendarHelper.el also have the following methods and properties:

  ```coffee
  testItemHelper =
    test: testContext
    # Where locator is a locator object, or a function returning the locator object based in during instantiation
    locator: locator

    # function that will return the locator object
    getLocator: function

    # The following are aliases of other useful functions for getting elements based on the stored locator
    get: test.utils.wait.for
    getAll: test.utils.wait.forMultiple

    findElement: test.driver.findElement
    findElements: test.driver.findElements

    forEach: test.utils.forEach
    isPresent: test.driver.isElementPresent
  ```
  See [test-element.coffee](./test-element.coffee) for details.
4. Extend the helper with additional UI process/action methods as needed, using el's element accessor methods:
  ```coffee
  class CalendarHelper extends TestHelper
    constructor: ...
    createNew: (type) =>
      @waitUntilLoaded()

      @el.addToggle.get().click()
      ...

    goPerformanceForecast: =>
      @test.utils.windowPosition.scrollTop()
      @el.forecastLink.get().click()

    goOpen: (title) =>
      # wait until the calendar is open
      @waitUntilLoaded()
      # TODO: Make this a `data-title` attribute
      # HACK: Might need to scroll the item to click on into view
      el = @el.planByTitle.get(title)
      @test.utils.windowPosition.scrollTo(el)
      el.click()
      @test.utils.windowPosition.scrollTop()
  ```

# Writing a spec

With the UI helper, a spec can look like this:




# Guiding Principles

As much as possible, we want to:

  * Make specs easily readable for
    * UI processes involved
    * Expectations
  * Decouple locators from the rest of the tests, because
    * This reduces clutter from the logic of the UI actions
    * Writing more high-level tests spanning multiples pages and processes should not require knowledge of locators
    * Locators are likely the parts of tests that will need updating the most
  * Keep locators in one place per UI page/component
    * To help us find where we need to update locators, and avoid missing updating locators that are used repeatedly
  * Expose common UI methods on the UI helpers
    * Reduce repeated code for common actions such as login, course select, etc
    * Decouples different UI specific processes from each other

Following these patterns, a spec would likely involve:
  * The spec
    * Contains all `expect`s
    * Declarative control of UI
    * Has no locators (css, linkText, etc)
  * The UI helper
    * Exposes access to common elements
    * Exposes UI methods
    * Stores locators for update as needed
  * Additional UI helpers
    * For specs that involve multiple UI pages/components

# Modifying the base UI helper

Sometimes you will need to add methods for a UI item that would be helpful in multiple places.  Please add to the base `TestItemHelper` or `TestHelper` as appropriate.  Nothing that is particularly specific to one test or item should be added to the base helper.
