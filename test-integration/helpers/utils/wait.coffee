selenium = require 'selenium-webdriver'

class Wait
  constructor: (test) -> @test = test

  # TODO reduce the copy pasta between for and forMultiple
  forMultiple: (locator, ms = 60 * 1000) ->
    locator = @test.utils.toLocator(locator)
    @giveTime ms, =>
      @test.utils.verboseWrap "Waiting for multiple #{JSON.stringify(locator)}", =>
        @test.driver.wait(selenium.until.elementsLocated(locator))
        # Because of animations an element might be in the DOM but not visible
        el = @test.driver.findElements(locator)

        el.then (elements) =>
          @test.utils.verbose("Found #{elements.count}")
          @test.driver.wait(selenium.until.elementIsVisible(elements[0]))

    el = @test.driver.findElements(locator)
    el

  # Waits for an element to be available and bumps up the timeout to be at least 60sec from now
  for: (locator, ms = 60 * 1000) ->
    locator = @test.utils.toLocator(locator)
    @giveTime ms, =>
      @test.driver.wait(selenium.until.elementLocated(locator))
      el = @test.driver.findElement(locator)
      # Because of animations an element might be in the DOM but not visible
      @test.utils.verboseWrap "Waiting for #{JSON.stringify(locator)}", => @test.driver.wait(selenium.until.elementIsVisible(el))
    el = @test.driver.findElement(locator)
    el

  click: (locator, ms) ->
    el = @for(locator, ms)
    el.click()
    # return el to support chaining the promises

  # Adjusts the test timeout for a function (which returns a Promise) time to execute
  giveTime: (ms, fn) ->
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

  until: (msg, fn) ->
    @test.utils.verboseWrap msg, =>
      @test.driver.wait(fn)

wait = (test) ->
  return new Wait(test)

module.exports = wait
