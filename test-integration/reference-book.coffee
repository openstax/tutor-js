{describe} = require './helpers'
selenium = require 'selenium-webdriver'
{expect} = require 'chai'
_ = require 'underscore'

SERVER_URL = process.env['SERVER_URL'] or 'http://localhost:3001/'
TEACHER_USERNAME = 'teacher01'

SECTIONS_TO_TEST = 10

describe 'Reference Book Exercises', ->

  @it 'Loads Biology reference book (readonly)', ->
    @login(TEACHER_USERNAME)

    checkForMissingExercises = =>
      # Wait until the book has loaded.
      @addTimeout(60)
      @waitAnd(css: '.page-wrapper .page.has-html')
        .then(closeMenuAndResizeBook)
        .then =>
          @forNTimesInSeries(SECTIONS_TO_TEST, checkEachPage)()

    closeMenuAndResizeBook = =>
      # resize prevents need to click next again
      @driver.manage().window().setSize(1080, 1080)
      @waitClick(css: '.menu-toggle')

    checkEachPage = =>
      hrefToCheck = null
      # Selenium sometimes keeps pressing the same next button (doneLoading doesn't seem to work 100%)
      @driver.wait(doneLoading)
        .then =>
          console.info('Find next href')
          @driver.findElement(css: 'a.page-navigation.next').getAttribute('href')
        .then (oldHref) =>
          console.log '----------------'
          console.info("Next href is #{oldHref}. Clicking next.")
          hrefToCheck = oldHref
          @driver.findElement(css: 'a.page-navigation.next').click()
        .then =>
          @driver.wait(doneLoading)
        .then =>
          checkPageChanged(hrefToCheck)

    doneLoading = =>
      # sleep to make sure exercises have a chance to start loading before checking if page is indeed done loading
      @sleep(100)
      @driver.isElementPresent(css: '.loadable.is-loading, .loading-exercise').then (isPresent) -> not isPresent

    checkPageChanged = (oldHref) =>
      @driver.findElement(css: 'a.page-navigation.next').getAttribute('href')
        .then (newHref) =>
          console.info('Moving from ',oldHref, 'to', newHref)
          nextStep = if newHref isnt oldHref then checkExercises else retryChangingPage
          nextStep()

    retryChangingPage = =>
      @addTimeout(3)
      console.log 'Page did not change. Reclicking.'
      # try again
      checkEachPage()

    checkExercises = =>
      console.info('Checking exercises.')
      currentPageUrl = null
      @driver.wait(doneLoading)
        .then =>
          @driver.getCurrentUrl()
        .then (pageUrl) =>
          currentPageUrl = pageUrl
          @driver.findElements(css: '[data-type="exercise"] .question')
        .then (elements) =>
          console.log "Found #{elements.length} exercises in #{currentPageUrl}"
          @driver.findElements(css: '.reference-book-missing-exercise')
        .then (elements) =>
          getMissingExerciseUrls = elements.map (element) ->
            element.getAttribute('data-exercise-url')
          Promise.all(getMissingExerciseUrls)
        .then (elementUrls) ->
          console.log "Found #{elementUrls.length} missing exercises in #{currentPageUrl}: #{JSON.stringify(elementUrls)}"

    # Open the reference book
    # Manually setting the URL because ref book opens in a new tab
    # Selenium has a way of handling this but I didn't read enough
    @driver
      .get("#{SERVER_URL}books/1")
      .then =>
        @injectErrorLogging()
      .then(checkForMissingExercises)
      .then =>
        @driver.get("#{SERVER_URL}books/1")
      .then =>
        @injectErrorLogging()
      .then(checkForMissingExercises)
