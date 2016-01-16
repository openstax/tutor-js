{describe} = require './helpers'
selenium = require 'selenium-webdriver'
{expect} = require 'chai'

SERVER_URL = process.env['SERVER_URL'] or 'http://localhost:3001/'
TEACHER_USERNAME = 'teacher01'

# decreased to 7, because sample bio only has 8 sections
SECTIONS_TO_TEST = 7

describe 'Reference Book Exercises', ->

  @it 'Loads Biology reference book (readonly)', ->
    @login(TEACHER_USERNAME)


    checkForMissingExercises = =>
      # Wait until the book has loaded.
      @addTimeout(60)
      @waitAnd(css: '.page-wrapper .page.has-html')
      @waitClick(css: '.menu-toggle')

      doneLoading = =>
        # Wait until the modal closes after clicking the date
        @driver.isElementPresent(css: '.loadable.is-loading, .loading-exercise').then (isPresent) -> not isPresent

      checkPageChanged = (oldHref) =>
        @driver.findElement(css: 'a.page-navigation.next').getAttribute('href')
          .then (newHref) =>
            console.info('Moving from ',oldHref, 'to', newHref)
            if newHref isnt oldHref
              ifPageDidntChange()
            else
              # only check exercises if new page has been loaded
              checkExercises()

      ifPageDidntChange = =>
        @addTimeout(3)
        console.log 'Page did not change. Reclicking.'
        # try again
        checkEachPage()

      checkExercises = =>
        console.info('Checking exercises.')
        @driver.getCurrentUrl().then (pageUrl) =>
          @addTimeout(3)
          @driver.findElements(css: '[data-type="exercise"] .question').then (elements) =>
            if elements.length
              console.log "Found #{elements.length} exercises"

          @driver.findElements(css: '.reference-book-missing-exercise').then (elements) =>
            if elements.length > 0
              console.log "Found #{elements.length} missing exercises in #{pageUrl}"
              # msg = []
              # for el in elements
              #   el.getAttribute('data-exercise-url').then (url) ->
              #     msg.push(url)
              #
              # @driver.getCurrentUrl().then =>
              #   console.log "Found #{elements.length} missing exercises in #{pageUrl}: #{JSON.stringify(msg)}"

      checkEachPage = =>
        hrefToCheck = null
        @driver.wait(doneLoading)
        # Selenium sometimes keeps pressing the same next button (doneLoading doesn't seem to work 100%)
        @driver.findElement(css: 'a.page-navigation.next').getAttribute('href')
          .then (oldHref) =>
            @addTimeout(3)
            console.log '----------------'

            hrefToCheck = oldHref
            @driver.findElement(css: 'a.page-navigation.next').click()
          .then =>
            @sleep(1000)
            @driver.wait(doneLoading)
          .then =>
            checkPageChanged(hrefToCheck)

      @forNTimesInSeries(SECTIONS_TO_TEST, checkEachPage)()

    @driver
      .get("#{SERVER_URL}books/2")
      .then(checkForMissingExercises)
    @injectErrorLogging()
    # Open the reference book
    # Manually setting the URL because ref book opens in a new tab
    # Selenium has a way of handling this but I didn't read enough
    @driver
      .get("#{SERVER_URL}books/1/section/1")
      .then(checkForMissingExercises)
    @injectErrorLogging()
