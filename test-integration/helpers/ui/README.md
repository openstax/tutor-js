# Writing a new UI helper

UI helpers should be in this folder.

1. Include the needed libraries

  ```coffee
  selenium = require 'selenium-webdriver'
  {TestHelper} = require './test-element'
  ```

2. Declare the common elements your will need to access in an object where properties are the common element's name, and the values are the locator objects, or a function that returns a locator object based on parameters.

  ```coffee
  COMMON_ELEMENTS =
    loadingState:
      css: '.calendar-loading'
    forecastLink:
      linkText: 'Performance Forecast'
    studentScoresLink:
      linkText: 'Student Scores'
    addToggle:
      css: '.add-assignment .dropdown-toggle'
    planByTitle: (title) ->
      css: ".plan label[data-title='#{title}']"
  ```

  Note that `loadingState` is an element whose locator that will [default to `css: '.is-loading'`](https://github.com/openstax/tutor-js/blob/master/test-integration/helpers/ui/test-element.coffee#L8-L10).  Here in this example, the calendar has a custom loading indicator (not `.is-loading`, `.calendar-loading`).

3. Create a new helper class that extends `TestHelper` and provide default options to the base constructor

  ```coffee
  class CalendarHelper extends TestHelper
    constructor: (testContext, testElementLocator) ->

      # the locator of the base UI
      testElementLocator ?=
        css: '.calendar-container'

      # Options for this helper.
      # and often takes longer than the default wait to load time of 1000ms.
      calendarOptions =
        defaultWaitTime: 3000

      # instantiate with options by calling the base `TestHelper`'s constructor
      super(testContext, testElementLocator, COMMON_ELEMENTS, calendarOptions)

      # Not commonly needed.
      # For this particular UI, a planPopup and methods controlling the popup
      # are helpful to separate from the main parent calendar UI helper methods.
      # PlanPopupHelper is an extended TestHelper like CalendarHelper is.
      @setCommonHelper('planPopup', new PlanPopupHelper(@test))
  ```
  You can read more about what happens when you instantiate [here](#details).

4. Extend the helper with additional UI process/action methods as needed, using el's element accessor methods:

  ```coffee
  class CalendarHelper extends TestHelper
    constructor: ...
    createNew: (type) =>
      @waitUntilLoaded()
      @el.addToggle().click()
      ...

    goPerformanceForecast: =>
      @el.forecastLink().click()

    goToOpenByTitle: (title) =>
      # wait until the calendar is open
      @waitUntilLoaded()

      el = @el.planByTitle(title).get()
      @test.utils.windowPosition.scrollTo(el)
      el.click()
      @waitUntilLoaded()
  ```

# Details

## TestHelper

UI helpers should be exposed in the [helper's index](../index.coffee).  In the specs, we can instantiate the `CalendarHelper` like this:

```coffee
Helpers = require './helpers'
calendar = new Helpers.Calendar(@)  # @ is the test context.
```

See [`describe.coffee`](../describe.coffee) for what `@` has access to.

There are also some calendar specific helper functions.  These were defined on the prototype of `CalendarHelper` above.

```coffee
calendar.createNew(type)
calendar.goPerformanceForecast()
calendar.goOpen(title)
```

These are elements you can use to test things about the calendar page.  They are defined by the `COMMON_ELEMENTS` object.

```coffee
calendar.el.forecastLink()          # <TestItemHelper>.fn
calendar.el.studentScoresLink()     # <TestItemHelper>.fn
calendar.el.addToggle()             # <TestItemHelper>.fn
calendar.el.planByTitle(title)      # <TestItemHelper>.fn
```

This additional element is available from explicitly calling `setCommonHelper`.

```coffee
calendar.el.planPopup()
```

Additionally, as a [`TestHelper`](./test-element.coffee#L93), calendar helper has the following methods:

```coffee
# This function will block all selenium based promises until
# the loading element is absent before continuing.
calendar.waitUntilLoaded(optionalWaitTime)

# The following are used to attach the helpers that are now on CalendarHelper.el
# They are exposed here for customizing your helper as needed,
# as in this case with the planPopup.
# Usually, you can just rely on the commonElements object.
calendar.setCommonHelper(name, helper)
calendar.setCommonElement(locator, name)
```

the following elements:

```coffee
# uses the loadingLocator option
calendar.el.loadingState()    # <TestItemHelper>.fn
# from the testElementLocator option
calendar.el.self()            # <TestItemHelper>.fn
```

and the following properties:

```coffee
calendar.test       # testContext
calendar.options    # options set when the calendar was instantiated
```

## TestItemHelper

A [`TestItemHelper`](./test-element.coffee#L6) can be instantiated like this:

```coffee
elementHelper = new TestItemHelper(@, locator)
```
where @ is the test context, and locator is either a css selector string, a selenium locator object, or a function that returns a locator object based on some paramters.

As instances of `TestItemHelper`, each of the elements on `calendarHelper.el` exposes the following methods:

```coffee
elementHelper.getLocator(optionalParameters) # should return a valid Selenium locator object
```

The other methods uses `getLocator` to get a Selenium locator before passing on into functions on the testContext's `driver` or our own defined `utils`.

```coffee
elementHelper.get(optionalParams, optionalWaitTime)     # alias for @utils.wait.for, waits until element is displayed or time runs out
elementHelper.getAll(optionalParams, optionalWaitTime)  # alias for @utils.wait.forMultiple, "" for multiple elements

elementHelper.findElement(optionalParams)   # @driver.findElement, tries to find element immediately without waiting
elementHelper.findElements(optionalParams)  # @driver.findElements, "" for mutiple elements

elementHelper.forEach(optionalParams)       # alias for @utils.forEach
elementHelper.isPresent(optionalParams)     # alias for @driver.isElementPresent

elementHelper.isDisplayed(optionalParams)   # is element displayed? using Selenium WebElement's isDisplayed

elementHelper.waitClick(optionalParams, optionalWaitTime) # alias for @utils.wait.click, waits until element is displayed before clicking
elementHelper.getParent(optionalParams)     # alias for @utils.dom.getParent
```

`TestItemHelper` is available as a function that returns methods exposed on `elementHelper.fn`.  This `fn` is what get's set on `TestHelper`'s `el`. This means you can use this syntax:

```coffee
elementHelper.fn(optionalParams).get()
```

`TestItemHelper` also exposes the following properties:

```coffee
elementHelper.test       # testContext
elementHelper.locator    # locator from instantiation
```

See [test-element.coffee](./test-element.coffee) for details.

# Modifying the base UI helper

Sometimes you will need to add methods for a UI item that would be helpful in multiple places.  Please add to the base `TestItemHelper` or `TestHelper` as appropriate.  Nothing that is particularly specific to one test or item should be added to the base helper.

# Learn More

* [How to write specs](../../writing-a-spec.md)
* [Helpers Overview](../README.md)
