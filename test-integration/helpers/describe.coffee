selenium = require 'selenium-webdriver'
seleniumMocha = require('selenium-webdriver/testing')
_ = require 'underscore'

chai = require 'chai'
chai.use require 'chai-as-promised'
expect = {chai}
fs = require 'fs'

SERVER_URL = process.env['SERVER_URL'] or 'http://localhost:3001/'

# Keep the history of commands run to help find where the error occurred
logger = selenium.logging.getLogger('webdriver.http.Executor')
logger.setLevel(selenium.logging.Level.ALL)
COMMAND_HISTORY = []
logger.addHandler (record) ->
  # Only print the last 100 items
  if COMMAND_HISTORY.length >= 100
    COMMAND_HISTORY.shift()
  COMMAND_HISTORY.push(record.getMessage())

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

    {it, iit, xit, before, after, afterEach, beforeEach} = seleniumMocha
    @it = it
    @iit = iit
    @xit = xit
    @before = before
    @after = after
    # Selenium uses a special `@beforeEach` and `@afterEach`
    @__beforeEach = beforeEach
    @__afterEach = afterEach

    @before ->

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

      @forEach = (css, fn) =>
        # Need to query multiple times because we might have moved screens so els are stale
        @driver.findElements(css: css).then (els1) =>
          index = 0
          _.each els1, (el) =>
            @driver.findElements(css: css).then (els) =>
              el = els[index]
              if els.length isnt els1.length
                throw new Error("Length changed during foreach! before: #{els1.length} after: #{els.length}")
              index += 1
              fn.call(@, el, index, els1.length)


      @login = (username, password = 'password') =>
        @addTimeout(10)
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
      timeout = @timeout
      currentTimeout = 0
      @addTimeout = (sec) =>
        # console.log 'adding to timeout (sec)', sec
        currentTimeout += sec * 1000
        timeout.call(@, currentTimeout, true)

      @timeout = (ms, isInternal) =>
        unless isInternal
          throw new Error('use addTimeout (preferably in the helper you are using) instead of timeout')
        if ms
          timeout.call(@, ms, isInternal)
        else
          timeout.call(@)

      @addTimeout(10)
      @driver.get(SERVER_URL)
      # Wait until the page has loaded.
      # Going to the root URL while logged in will redirect to dashboard
      # which may redirect to the course page.
      @driver.wait(selenium.until.elementLocated(css: '#react-root-container .-hamburger-menu, body#home'))
      @logout().then ->
        # Clear the history
        COMMAND_HISTORY.splice(0, COMMAND_HISTORY.length)



    @__afterEach ->
      @addTimeout(2 * 60) # Server might still be deleting/publishing
      {state, title} = @currentTest

      if state is 'failed'
        console.log 'Action history (showing last 100):'
        for msg in COMMAND_HISTORY
          console.log msg
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
