selenium = require 'selenium-webdriver'
test = require('selenium-webdriver/testing')
{Promise} = require('es6-promise')

chai = require 'chai'
chai.use require 'chai-as-promised'
expect = {chai}
fs = require 'fs'

screenshot = (driver, filename) ->
  fn = (data) ->
    base64Data = data.replace(/^data:image\/png;base64,/, "")

    # Make sure the screenshot returns a promise
    new Promise (resolve, reject) ->
      fs.writeFile filename, base64Data, 'base64', (err) ->
        if err
          reject(err)
        else
          resolve(true)

  p = driver.takeScreenshot().then(fn)
  # expect(p).to.eventually.be.truthy
  p


module.exports =
  describe: (name, cb) ->
    test.describe name, ->

      {it, before, after, afterEach, beforeEach} = test
      @__it = it
      @__before = before
      @__after = after
      @__beforeEach = beforeEach
      @__afterEach = afterEach
      @__screenshot = screenshot

      @__before ->
        @driver = new selenium.Builder()
          # .withCapabilities(selenium.Capabilities.phantomjs())
          .withCapabilities(selenium.Capabilities.chrome())
          .build()

        @selenium = selenium
        @waitAnd = (locator) =>
          @driver.wait selenium.until.elementLocated(locator)
          # Because of animations an element might be in the DOM but not visible
          el = @driver.findElement(locator)
          @driver.wait selenium.until.elementIsVisible(el)
          el

        @waitClick = (locator) =>
          el = @waitAnd(locator)
          el.click()
          # return el to support chaining the promises
          el


      @__afterEach ->
        {state, title} = @currentTest
        if state is 'failed'
          screenshot(@driver, "test-failed-#{title}.png")
        # else
        #   screenshot(@driver, "test-#{title}.png")

      @__after ->
        @driver.quit()

      cb.call(@)
