_ = require 'underscore'
{TestHelper} = require './test-element'

COMMON_ELEMENTS =

  selectSectionsContainer:
    css: '.homework-plan-exercise-select-topics'

  addExercisesContainer:
    css: '.add-exercise-list'

  closeButton:
    css: '.footer-buttons [aria-role="close"]'


EXERCISE_SELECTOR_ELEMENTS =
  inactiveExerciseCard:
    css: '.openstax.exercise-wrapper .has-actions:not(.is-selected) .panel-body'

  reviewExercisesButton:
    css: '.btn.-review-exercises'


class ExerciseSelector extends TestHelper
  constructor: (test, testElementLocator) ->
    testElementLocator ?= EXERCISE_SELECTOR_ELEMENTS.inactiveExerciseCard
    super test, testElementLocator, EXERCISE_SELECTOR_ELEMENTS, defaultWaitTime: 3000

  selectNumberOfExercises: (numExercises) ->
    @waitUntilLoaded()
    for i in [0...numExercises]
      @el.inactiveExerciseCard().findElement().then (inactiveExercise) =>
        @test.utils.windowPosition.scrollTo(inactiveExercise)
        @test.driver.actions().mouseMove(inactiveExercise).perform()
        inactiveExercise.findElement(css: '.include').click()

  startReview: () ->
    @el.reviewExercisesButton().waitClick()


module.exports = ExerciseSelector
