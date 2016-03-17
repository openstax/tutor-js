selenium = require 'selenium-webdriver'
{TestHelper} = require './test-element'

COMMON_ELEMENTS =
  loadingState:
    css: '.loadable.is-loading'
  nextPageButton:
    css: 'a.page-navigation.next'
  tocToggle:
    css: '.menu-toggle'
  exerciseElements:
    css: '[data-type="exercise"] .openstax-question'
  missingExercises:
    css: '.reference-book-missing-exercise'
  loadingExercises:
    css: '.loading-exercise'


class ReferenceBook extends TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?= css: '.reference-book'
    super test, testElementLocator, COMMON_ELEMENTS, defaultWaitTime: 10000

  waitUntilExercisesLoaded: =>
    @el.loadingExercises().findElements().then (loadingExercises) =>
      waitTime = loadingExercises.length * 3000

      @test.driver.wait =>
        @el.loadingExercises().isPresent().then (isPresent) -> not isPresent
      , waitTime

  open: =>
    @waitUntilLoaded()
    @test.utils.windowPosition.setLarge()
    @el.tocToggle().click()

  focus: =>
    @test.driver.getAllWindowHandles().then (handles) =>
      @test.driver.switchTo().window(handles[1])

  close: =>
    @test.driver.getAllWindowHandles().then (handles) =>
      @test.driver.switchTo().window(handles[1])
      @test.driver.close()
      @test.driver.switchTo().window(handles[0])

  goNext: =>
    # go next until old href isnt
    @test.driver.wait =>
      oldNextHref = ''
      @el.nextPageButton().get().getAttribute('href').then (href) =>
        oldNextHref = href
        @el.nextPageButton().click()
        @waitUntilLoaded()
        @el.nextPageButton().get().getAttribute('href')
      .then (href) ->
        console.log 'From old next', oldNextHref, 'to next next', href
        oldNextHref isnt href
    , @_options.defaultWaitTime

  findMissingExerciseUrls: =>
    @el.missingExercises().findElements().then (missingExercises) =>
      selenium.promise.fullyResolved missingExercises.map (missingExercise) ->
        missingExercise.getAttribute('data-exercise-url')

  logExercises: ({exercises, missingUrls}) =>
    console.log("Found #{exercises.length} exercises")
    console.info('Exercises missing with these URLs', missingUrls)
    {exercises, missingUrls}

  checkExercisesOnPage: =>
    @waitUntilExercisesLoaded()

    checkExercises = [
      @el.exerciseElements().findElements()
      @findMissingExerciseUrls()
    ]

    selenium.promise.all(checkExercises).then ([exercises, missingUrls]) =>
      {exercises, missingUrls}


module.exports = ReferenceBook
