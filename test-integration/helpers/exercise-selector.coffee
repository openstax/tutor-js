_ = require 'underscore'
{expect} = require 'chai'
selenium = require 'selenium-webdriver'

SelectReadingsList = require './select-readings-dialog'
UnsavedDialog = require './unsaved-dialog'
Calendar = require './calendar'
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
    css: '.card.exercise.panel.panel-default'

  reviewExercisesButton:
    css: '.exercise-summary .btn.-review-exercises'


class ExerciseSelector extends TestHelper
  constructor: (test, testElementLocator) ->
    testElementLocator ?= css: '.add-exercise-list'
    super test, testElementLocator, EXERCISE_SELECTOR_ELEMENTS, defaultWaitTime: 3000

  selectNumberOfExercises: (numExercises) ->
    _.times numExercises, =>
      @el.inactiveExerciseCard.click()

  startReview: () ->
    @el.reviewExercisesButton.click()


module.exports = ExerciseSelector
