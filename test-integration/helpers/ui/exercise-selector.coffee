_ = require 'underscore'
{TestHelper} = require './test-element'

ROOT_EXERCISE_SELECTOR_CONTAINER = '.homework-plan-exercise-select-topics .pinned-container'

EXERCISE_SELECTOR_ELEMENTS =
  loadingState:
    css: "#{ROOT_EXERCISE_SELECTOR_CONTAINER} .hw-loading"

  inactiveExerciseCard:
    css: '.openstax.exercise-wrapper .has-actions:not(.is-selected) .panel-body'

  reviewExercisesButton:
    css: '.btn.-review-exercises'

  actions: (action) ->
    css: ".controls-overlay .action.#{action}"

class ExerciseSelector extends TestHelper
  constructor: (test, testElementLocator) ->
    testElementLocator ?= css: "#{ROOT_EXERCISE_SELECTOR_CONTAINER} .add-exercise-list"
    super test, testElementLocator, EXERCISE_SELECTOR_ELEMENTS, defaultWaitTime: 3000

  selectNumberOfExercises: (numExercises) ->
    @waitUntilLoaded()
    for i in [0...numExercises]
      exerciseCount = 0

      @el.inactiveExerciseCard().findElement().then (inactiveExercise) =>
        exerciseCount = exerciseCount + 1
        console.log 'Adding exercise', exerciseCount, 'of', numExercises
        @test.utils.windowPosition.scrollTo(inactiveExercise)
        @test.driver.actions().mouseMove(inactiveExercise).perform()
        @el.actions('include').getOn(inactiveExercise).click()

  startReview: () ->
    @el.reviewExercisesButton().waitClick()


module.exports = ExerciseSelector
