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
      # The calendar has a custom loading indicator (not `.is-loading`),
      # and often takes longer than the default wait to load time of 1000ms.
      calendarOptions =
        loadingLocator:
          css: '.calendar-loading'
        defaultWaitTime: 3000

      # instantiate with options by calling the base `TestHelper`'s constructor
      super(testContext, testElementLocator, COMMON_ELEMENTS, calendarOptions)

      # Not commonly needed.
      # For this particular UI, a planPopup and methods controlling the popup
      # are helpful to separate from the main parent calendar UI helper methods.
      # PlanPopupHelper is an extended TestHelper like CalendarHelper is.
      @setCommonHelper('planPopup', new PlanPopupHelper(@test))
  ```
  You can read more about what happens when you instantiate [here](#helper-details).

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

# Helper Details

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

  # This function will block all selenium based promises until
  # the loading element is absent before continuing.
  waitUntilLoaded: (waitTime = @options.defaultWaitTime) =>
    @test.driver.wait =>
      @el.loadingState.isPresent().then (isPresent) -> not isPresent
    , waitTime

  # The following are used to attach the helpers that are now on CalendarHelper.el
  # They are exposed here for customizing your helper as needed,
  # as in this case with the planPopup.
  # Usually, you can just rely on the commonElements object.
  setCommonHelper: (name, helper) =>
    @el[name] = helper
  setCommonElement: (locator, name) =>
    @setCommonHelper(name, new TestItemHelper(@test, locator))
```
Note that TestHelper itself is extended from `TestItemHelper`, meaning `calendarHelper` and the items on `calendarHelper.el` also have the following methods and properties:

```coffee
testItemHelper =
  test: testContext
  # Where locator is a locator object, or
  # a function returning the locator object based in during instantiation
  locator: locator

  # function that will return only the locator object
  getLocator: function

  # The following are aliases of other useful functions
  # for getting elements based on the stored locator
  get: test.utils.wait.for
  getAll: test.utils.wait.forMultiple

  findElement: test.driver.findElement
  findElements: test.driver.findElements

  forEach: test.utils.forEach
  isPresent: test.driver.isElementPresent
```
See [test-element.coffee](./test-element.coffee) for details.

# Modifying the base UI helper

Sometimes you will need to add methods for a UI item that would be helpful in multiple places.  Please add to the base `TestItemHelper` or `TestHelper` as appropriate.  Nothing that is particularly specific to one test or item should be added to the base helper.