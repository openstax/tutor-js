selenium = require 'selenium-webdriver'
_ = require 'underscore'

class Wait
  constructor: (test) -> @test = test

  _for: (settings) =>

    defaultSettings =
      find: @test.driver.findElement.bind(@test.driver)
      untilLocated: selenium.until.elementLocated
      untilReady: selenium.until.elementIsVisible
      buildWaitMessage: (locator) ->
        "Looking for #{JSON.stringify(locator)}"
      buildFoundMessage: (locator, result) ->
        "Found #{JSON.stringify(locator)}"
      buildDisplayMessage: (locator) ->
        "Waiting for #{JSON.stringify(locator)} to show"
      filter: (result) ->
        result

    settings = _.extend({}, defaultSettings, settings)
    {find, untilLocated, untilReady, buildWaitMessage, buildFoundMessage, buildDisplayMessage, filter} = settings

    (locator, ms = 60 * 1000) =>
      locator = @test.utils.toLocator(locator)

      @giveTime ms, =>
        @until buildWaitMessage(locator), untilLocated(locator)
        # Because of animations an element might be in the DOM but not visible
        find(locator).then (result) =>
          @test.utils.verbose(buildFoundMessage(locator, result))
          @until buildDisplayMessage(locator), untilReady(filter(result))

      el = find(locator)
      el

  forMultiple: (locator, ms = 60 * 1000) =>
    settings =
      find: @test.driver.findElements.bind(@test.driver)
      untilLocated: selenium.until.elementsLocated
      buildWaitMessage: (locator) ->
        "Looking for multiple #{JSON.stringify(locator)}"
      buildFoundMessage: (locator, result) ->
        "Found #{result.count} matching #{JSON.stringify(locator)}"
      filter: (result) ->
        result[0]

    @_for(settings)(locator, ms)

  # Waits for an element to be displayed and bumps up the timeout to be at least 60sec from now
  for: (locator, ms = 60 * 1000) =>
    @_for()(locator, ms)

  # Waits for an element to be enabled and bumps up the timeout to be at least 60sec from now
  forHidden: (locator, ms = 60 * 1000) =>
    settings = 
      untilReady: selenium.until.elementIsEnabled

    @_for(settings)(locator, ms)


  forOn: (locator, ms = 60 * 1000, element) =>
    settings =
      find: element.findElement.bind(element)

    @_for(settings)(locator, ms)

  click: (locator, ms) =>
    @test.utils.verboseWrap "Wait and click #{JSON.stringify(locator)}", =>
      el = @for(locator, ms)
      # Scroll to element so that it's clickable
      @test.utils.windowPosition.scrollTo(el)
      @test.utils.verbose "Clicking #{JSON.stringify(locator)}"
      # el click promise returns from verbose wrapping and can be chained
      el.click()

  # Adjusts the test timeout for a function (which returns a Promise) time to execute
  giveTime: (ms, fn) =>
    start = null
    @test.driver.call => # Enqueue the timeout to increase only once this starts
      start = Date.now()
      @test.addTimeoutMs(ms)
    fn().then (val) =>
      end = Date.now()
      spent = end - start
      diff = ms - spent
      # console.log "Took #{spent / 1000}sec of #{ms / 1000}"
      if spent > ms
        throw new Error("BUG: Took longer than expected (#{spent / 1000}). Expected #{ms / 1000} sec")

      # @test.addTimeoutMs(-diff)
      # Ensure there is at most 10sec left afterwards
      @test.timeout.extendFromNow()

      val

  until: (msg, fn) =>
    @test.utils.verboseWrap msg, =>
      @test.driver.wait(fn)

wait = (test) ->
  return new Wait(test)

module.exports = wait
