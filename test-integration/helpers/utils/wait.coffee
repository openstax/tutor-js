selenium = require 'selenium-webdriver'
toLocator = require './to-locator'
windowPosition = require './window-position'

class Wait
  constructor: (test) -> @test = test

  forMultiple: (locator, ms = 60 * 1000) ->
    locator = toLocator(locator)
    start = null
    timeout = 0
    @test.driver.call => # Enqueue the timeout to increase only once this starts
      start = Date.now()
      @test.addTimeoutMs(ms)
    @test.driver.wait(selenium.until.elementsLocated(locator))
    .then (val) =>
      end = Date.now()
      spent = end - start
      diff = ms - spent
      # console.log "Took #{spent / 1000}sec of #{ms / 1000}"
      if spent > ms
        throw new Error("BUG: Took longer than expected (#{spent / 1000}). Expected #{ms / 1000} sec")
      @test.addTimeoutMs(-diff)
      val
    # Because of animations an element might be in the DOM but not visible
    el = @test.driver.findElements(locator)

    el.then (elements) =>
      @test.driver.wait(selenium.until.elementIsVisible(elements[0]))

    el

  # Waits for an element to be available and bumps up the timeout to be at least 60sec from now
  for: (locator, ms = 60 * 1000) ->
    locator = toLocator(locator)
    start = null
    @test.driver.call => # Enqueue the timeout to increase only once this starts
      start = Date.now()
      @test.addTimeoutMs(ms)
    @test.driver.wait(selenium.until.elementLocated(locator))
    .then (val) =>
      end = Date.now()
      spent = end - start
      diff = ms - spent
      # console.log "Took #{spent / 1000}sec of #{ms / 1000}"
      if spent > ms
        throw new Error("BUG: Took longer than expected (#{spent / 1000}). Expected #{ms / 1000} sec")
      @test.addTimeoutMs(-diff)
      val
    # Because of animations an element might be in the DOM but not visible
    el = @test.driver.findElement(locator)
    @test.driver.wait(selenium.until.elementIsVisible(el))
    el

  click: (locator, ms) ->
    el = @for(locator, ms)
    # Scroll to the top so the navbar does not obstruct what we are clicking
    windowPosition(@test).scrollTop()
    el.click()
    # return el to support chaining the promises
    el


wait = (test) ->
  return new Wait(test)

module.exports = wait
