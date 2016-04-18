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
    css: '.openstax.exercise-wrapper .is-selectable:not(.is-selected)'

  reviewExercisesButton:
    css: '.btn.-review-exercises'


class ExerciseSelector extends TestHelper
  constructor: (test, testElementLocator) ->
    testElementLocator ?= css: '.add-exercise-list'
    super test, testElementLocator, EXERCISE_SELECTOR_ELEMENTS, defaultWaitTime: 3000

  selectNumberOfExercises: (numExercises) ->
    for i in [0...numExercises]
      @el.inactiveExerciseCard().waitClick(30*1000)

  startReview: () ->
    @el.reviewExercisesButton().waitClick()


module.exports = ExerciseSelector
