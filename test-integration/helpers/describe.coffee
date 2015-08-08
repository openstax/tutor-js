selenium = require 'selenium-webdriver'
seleniumMocha = require('selenium-webdriver/testing')

chai = require 'chai'
chai.use require 'chai-as-promised'
expect = {chai}
fs = require 'fs'

SERVER_URL = process.env['SERVER_URL'] or 'http://localhost:3001/'

# Helper for saving screenshots
screenshot = (driver, filename) ->
  fn = (data) ->
    base64Data = data.replace(/^data:image\/png;base64,/, "")

    # Make sure the screenshot returns a promise
    new selenium.promise.Promise (resolve, reject) ->
      fs.writeFile "#{filename}.png", base64Data, 'base64', (err) ->
        if err
          reject(err)
        else
          resolve(true)

  p = driver.takeScreenshot().then(fn)
  # expect(p).to.eventually.be.truthy
  p


module.exports = (name, cb) ->
  seleniumMocha.describe name, ->

    {it, xit, before, after, afterEach, beforeEach} = seleniumMocha
    @it = it
    @xit = xit
    @before = before
    @after = after
    # Selenium uses a special `@beforeEach` and `@afterEach`
    @__beforeEach = beforeEach
    @__afterEach = afterEach

    @before ->
      @timeout 30 * 1000 # Wait 30sec before timing out

      @driver = new selenium.Builder()
        # .withCapabilities(selenium.Capabilities.phantomjs())
        .withCapabilities(selenium.Capabilities.chrome())
        .build()

      @screenshot = (args...) => screenshot(@driver, args...)

      # Generate a set of 5 random characters
      @freshId = -> '_selenium ' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)

      @waitAnd = (locator) =>
        @driver.wait(selenium.until.elementLocated(locator))
        # Because of animations an element might be in the DOM but not visible
        el = @driver.findElement(locator)
        @driver.wait(selenium.until.elementIsVisible(el))
        el

      @waitClick = (locator) =>
        el = @waitAnd(locator)
        @scrollTop()
        el.click()
        # return el to support chaining the promises
        el

      @scrollTop = =>
        # @driver.executeScript("arguments[0].scrollIntoView(true);", el)
        @driver.executeScript("window.scrollTo(0,0);")
        @driver.sleep(200)

      @scrollTo = (el) =>
        @driver.executeScript("arguments[0].scrollIntoView(true);", el)
        @driver.sleep(100)


      @logout = =>
        # Push the Log out button (ref book does not have one)
        @driver.isElementPresent(css: '.-hamburger-menu').then (isPresent) =>
          if isPresent
            @waitClick(css: '.-hamburger-menu') # Expand the menu
            @waitAnd(css: '.-hamburger-menu .-logout-form').submit()

      # Check for JS errors by injecting a little script before the test and then checking it afterEach
      @injectErrorLogging = =>
        # Check for JS errors by injecting a little script before the test and then checking it afterEach
        @driver.executeScript ->
          originalOnError = window.onerror
          unless window.IS_CHECKING_FOR_ERRORS
            window.IS_CHECKING_FOR_ERRORS = true
            window.onerror = (msg, args...) ->
              document.querySelector('body').setAttribute('data-js-error', msg)
              originalOnError?(msg, args...)


      @login = (username, password='password') =>

        @waitClick(linkText: 'Login')

        # Decide if this is local or deployed
        @waitAnd(css: '#auth_key, #search_query')
        @driver.isElementPresent(css: '#search_query').then (isPresent) =>
          if isPresent
            # Login as local
            @driver.findElement(css: '#search_query').sendKeys(username)
            @driver.findElement(css: '#search_query').submit()

            @waitClick(linkText: username)

          else
            # Login as dev (using accounts)
            @driver.findElement(css: '#auth_key').sendKeys(username)
            @driver.findElement(css: '#password').sendKeys(password)
            @driver.findElement(css: '.password-actions button.standard').click()

        # Verify React loaded
        @driver.wait selenium.until.elementLocated(css: '#react-root-container [data-reactid]')

        @injectErrorLogging()


    @__beforeEach ->
      @timeout 20 * 1000
      @driver.get(SERVER_URL)
      # Wait until the page has loaded.
      # Going to the root URL while logged in will redirect to dashboard
      # which may redirect to the course page.
      @driver.wait(selenium.until.elementLocated(css: '#react-root-container .-hamburger-menu, body#home'))
      @logout()


    @__afterEach ->
      @timeout 5 * 60 * 1000 # Server might still be deleting/publishing
      {state, title} = @currentTest

      if state is 'failed'
        console.log 'Selenium Schedule:'
        console.log @driver.controlFlow().getSchedule()
        console.log '------------------'
        screenshot(@driver, "test-failed-#{title}")
      # else
      #   screenshot(@driver, "test-#{title}")

      # in case any alerts switched focus
      # @driver.switchTo().defaultContent().then -> console.log 'sdkjfhsdkfh'

      # Fail if there were any errors
      @driver.findElement(css: 'body').getAttribute('data-js-error').then (msg) ->
        if msg
          console.log 'JS Error! ' + msg
          screenshot(@driver, "test-failed-#{title}")


      # Print out all the console messages
      # logs = @driver.manage().logs().get('browser').then (lines) ->
      #   console.log line.level.name, line.message for line in lines

      @logout()


    @after ->
      @driver.quit()

    cb.call(@)
