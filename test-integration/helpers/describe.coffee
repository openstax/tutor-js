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
COMMAND_HISTORY_MAX = 20
logger.addHandler (record) ->
  # Only print the last COMMAND_HISTORY_MAX items
  if COMMAND_HISTORY.length >= COMMAND_HISTORY_MAX
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



describe = (name, cb) ->
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

      # Wait 20sec for the browser to start up
      @timeout(20 * 1000, true)

      @driver = new selenium.Builder()
        # .withCapabilities(selenium.Capabilities.phantomjs())
        .withCapabilities(selenium.Capabilities.chrome())
        .build()

      @screenshot = (args...) => screenshot(@driver, args...)

      # Generate a set of 2 random characters
      # Shorter is good for views that add '...' when not enough room (like calendar)
      @freshId = -> '_SE ' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 2)

      @toLocator = (locator) =>
        if typeof locator is 'string'
          console.warn("Please use {css: '#{locator}'} instead of just a string as the argument")
          {css: locator}
        else
          locator


      # Waits for an element to be available and bumps up the timeout to be at least 60sec from now
      @waitAnd = (locator, ms=60 * 1000) =>
        locator = @toLocator(locator)
        start = null
        @driver.call => # Enqueue the timeout to increase only once this starts
          start = Date.now()
          @addTimeoutMs(ms)
        @driver.wait(selenium.until.elementLocated(locator))
        .then (val) =>
          end = Date.now()
          spent = end - start
          diff = ms - spent
          # console.log "Took #{spent / 1000}sec of #{ms / 1000}"
          if spent > ms
            throw new Error("BUG: Took longer than expected (#{spent / 1000}). Expected #{ms / 1000} sec")
          @addTimeoutMs(-diff)
          val
        # Because of animations an element might be in the DOM but not visible
        el = @driver.findElement(locator)
        @driver.wait(selenium.until.elementIsVisible(el))
        el

      @waitClick = (locator, ms) =>
        el = @waitAnd(locator, ms)
        # Scroll to the top so the navbar does not obstruct what we are clicking
        @scrollTop()
        el.click()
        # return el to support chaining the promises
        el

      @scrollTop = =>
        # @driver.executeScript("arguments[0].scrollIntoView(true);", el)
        @driver.executeScript("window.scrollTo(0,0);")
        @sleep(200)

      @scrollTo = (el) =>
        @driver.executeScript("arguments[0].scrollIntoView(true);", el)
        @sleep(200)


      @logout = =>
        # Close the modal if one is open
        @driver.isElementPresent(css: '.modal-dialog .modal-header .close').then (isPresent) =>
          if isPresent
            # Close the modal
            console.log 'There is an open dialog. Closing it as part of logout'
            @waitClick(css: '.modal-dialog .modal-header .close')

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

      # Useful for exhaustive testing like "Click all the links in the Student Scores"
      # Takes 2 args plus one optional one
      # - `options`: Either a string indicating the CSS selector or an object with the following:
      #   - `css` : a string CSS locator
      #   - `linkText`: a string linkText locator
      #   - `ignoreLengthChange`: a boolean indicating that it is OK for the list of elements to change
      #     - This is useful for the Student Scores whose table lazily adds student rows when scrolled
      @forEach = (options, fn, fn2) =>
        if typeof options is 'string'
          locator = {css: options}
        else
          {css, linkText, ignoreLengthChange} = options
          if linkText
            locator = {linkText}
          else if css
            locator = {css}
          else
            throw new Error("Unknown locator format. So far only linkText and css are recognized. #{options}")

        # Need to query multiple times because we might have moved screens so els are stale
        @driver.findElements(locator).then (els1) =>
          index = 0
          fn2?(els1) # Allow for things like printing "Clicking on 20 drafts"
          _.each els1, (el) =>
            @driver.findElements(locator).then (els) =>
              el = els[index]
              if els.length isnt els1.length and not ignoreLengthChange
                throw new Error("Length changed during foreach! before: #{els1.length} after: #{els.length}")
              index += 1
              unless el
                throw new Error("Bug. Looks like an element disappeared! index=#{index} before:#{els1.length} after: #{els.length}")
              # scroll if the element is not visible
              el.isDisplayed().then (isDisplayed) =>
                unless isDisplayed
                  @scrollTo(el)
                fn.call(@, el, index, els1.length)


      @login = (username, password = 'password') =>
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
      testStartTime = Date.now()

      @addTimeout = (sec) =>
        @addTimeoutMs(sec * 1000)

      @addTimeoutMs = (ms) =>
        currentTimeout += ms
        now = Date.now()
        msFromNow = testStartTime + currentTimeout - now
        msFromNow = Math.max(msFromNow, 60 * 1000) # Always make the timeout at least 60sec
        if ms > 60 * 1000 # If we are extending more than the default 60sec the log it
          console.log "[Timeout extended by #{ms / 1000}sec]"
        timeout.call(@, msFromNow, true) # The extra arg is isInternal for use in the overridden @timeout

      @sleep = (ms) =>
        @driver.call =>
          @addTimeoutMs(ms * 2) # Add some extra ms just in case
          @driver.sleep(ms)

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
        console.log "Action history (showing last #{COMMAND_HISTORY_MAX}):"
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

module.exports =
  describe: describe
  xdescribe: seleniumMocha.xdescribe
