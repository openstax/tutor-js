{describe, wait, User} = require './helpers'
selenium = require 'selenium-webdriver'
{expect} = require 'chai'

SERVER_URL = process.env['SERVER_URL'] or 'http://localhost:3001/'
TEACHER_USERNAME = 'teacher01'

SECTIONS_TO_TEST = 5

describe 'Reference Book Exercises', ->

  @it 'Loads Biology reference book (readonly)', ->
    new User(@, TEACHER_USERNAME).login()

    checkForMissingExercises = =>
      # Wait until the book has loaded.
      @addTimeout(60)
      wait(@).click(css: '.menu-toggle')

      doneLoading = =>
        # Wait until the modal closes after clicking the date
        @driver.isElementPresent(css: '.loadable.is-loading, .loading-exercise').then (isPresent) -> not isPresent

      for i in [1..SECTIONS_TO_TEST]
        # Selenium sometimes keeps pressing the same next button (doneLoading doesn't seem to work 100%)
        @driver.findElement(css: 'a.page-navigation.next').getAttribute('href').then (oldHref) =>
          @addTimeout(3)

          @driver.findElement(css: 'a.page-navigation.next').click()

          @driver.wait(doneLoading)
          # @driver.findElement(css: 'a.page-navigation.next').getAttribute('href').then (foo) =>
          #   console.log 'new ashkd', foo

          checkPageChanged = =>
            @driver.findElement(css: 'a.page-navigation.next').getAttribute('href').then (newHref) =>
              newHref isnt oldHref

          ifPageDidntChange = =>
            @addTimeout(3)
            console.log 'Page did not change. reclicking.'
            @driver.findElement(css: 'a.page-navigation.next').click()
            @driver.wait(doneLoading)

          @driver.wait(checkPageChanged, 1000).then(null, ifPageDidntChange)


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

    @driver.get("#{SERVER_URL}books/2")
    @injectErrorLogging()
    checkForMissingExercises()
    # Open the reference book
    # Manually setting the URL because ref book opens in a new tab
    # Selenium has a way of handling this but I didn't read enough
    @driver.get("#{SERVER_URL}books/1")
    @injectErrorLogging()
    checkForMissingExercises()
