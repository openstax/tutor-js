fs = require 'fs'
selenium = require 'selenium-webdriver'
seleniumMocha = require('selenium-webdriver/testing')
_ = require 'underscore'

chai = require 'chai'
chai.use require 'chai-as-promised'
expect = {chai}
User = require './user'
Timeout = require './timeout'

utils = require './utils'
Verbose = require './utils/verbose'

screenshot = require './utils/screenshot'
SERVER_URL = process.env['SERVER_URL'] or 'http://localhost:3001/'

# Keep the history of commands run to help find where the error occurred
logger = selenium.logging.getLogger('webdriver.http.Executor')
logger.setLevel(selenium.logging.Level.ALL)
COMMAND_HISTORY = []
COMMAND_HISTORY_MAX = 2
logger.addHandler (record) ->
  # Only print the last COMMAND_HISTORY_MAX items
  if COMMAND_HISTORY.length >= COMMAND_HISTORY_MAX
    COMMAND_HISTORY.shift()
  COMMAND_HISTORY.push(record.getMessage())





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
      Verbose.reset()

      # Wait 20sec for the browser to start up
      @timeout(20 * 1000, true)

      @driver = new selenium.Builder()
        # Choose which browser to run by setting the SELENIUM_BROWSER='firefox' envoronment variable
        # see https://selenium.googlecode.com/git/docs/api/javascript/module_selenium-webdriver_class_Builder.html
        .withCapabilities(selenium.Capabilities.phantomjs()) # TODO: get alerts working https://github.com/robotframework/Selenium2Library/issues/441
        .withCapabilities(selenium.Capabilities.firefox())
        .withCapabilities(selenium.Capabilities.chrome())
        .build()


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


    @__beforeEach ->
      Verbose.reset()
      Timeout.installCustomImplementation(@)

      @utils = utils(@)

      {state, title} = @currentTest
      if state isnt 'failed'

        @addTimeout(10)
        @driver.get(SERVER_URL)
        # Wait until the page has loaded.
        # Going to the root URL while logged in will redirect to dashboard
        # which may redirect to the course page.
        @driver.wait(selenium.until.elementLocated(css: '#react-root-container .-hamburger-menu, body#home'))
        User.logout(@).then ->
          # Clear the history
          COMMAND_HISTORY.splice(0, COMMAND_HISTORY.length)
          Verbose.reset()




    @__afterEach ->
      @addTimeout(2 * 60) # Server might still be deleting/publishing
      {state, title} = @currentTest

      # # Print out all the console messages
      # console.log 'Printing log Messages'
      # console.log '----------------------------------'
      # @driver.manage().logs().get('browser').then (lines) ->
      #   console.log line.level.name, line.message for line in lines

      if state is 'failed'
        @utils.screenshot("test-failed-#{title}")
        console.log "Action history (showing last #{COMMAND_HISTORY_MAX}):"
        for msg in COMMAND_HISTORY
          console.log msg
        console.log '------------------'
        unless Verbose.isEnabled()
          for msg in Verbose.getLog()
            console.log(msg...)

      # Fail if there were any errors
      @driver.findElement(css: 'body').getAttribute('data-js-error').then (msg) =>
        if msg
          console.log 'JS Error! ' + msg
          @utils.screenshot("test-failed-#{title}")


      Verbose.reset()
      User.logout(@).then ->
        # Save the coverage data to a file
        # Keep replacing the file as tests finish (the object will continue to be appended to in memory)
        coverageData = User.getCoverageData()
        fs.writeFileSync('./coverage-selenium.json', JSON.stringify(coverageData), 'utf8')


    @after ->
      @driver.quit()

    cb.call(@)

module.exports =
  describe: describe
  xdescribe: seleniumMocha.xdescribe
