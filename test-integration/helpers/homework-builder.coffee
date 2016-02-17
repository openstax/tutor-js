_ = require 'underscore'
{expect} = require 'chai'
selenium = require 'selenium-webdriver'

SelectReadingsList = require './select-readings-dialog'
UnsavedDialog = require './unsaved-dialog'
Calendar = require './calendar'
{TestHelper} = require './test-element'

COMMON_ELEMENTS =
  selectProblemsBtn:
    css: '#problems-select'

  selectSectionsContainer:
    css: '.homework-plan-exercise-select-topics'

  showProblemsBtn:
    css: '.homework-plan-exercise-select-topics button.-show-problems'

  addExercisesContainer:
    css: '.add-exercise-list'

  selectedExercises:
    css: '.card.exercise.panel'

  numExercisesSelected:
    css: '.exercise-summary .num-selected h2'

  addTutorSelection:
    css: '.exercise-summary .tutor-selections .btn.-move-exercise-up'

  removeTutorSelection:
    css: '.exercise-summary .tutor-selections .btn.-move-exercise-down'

  tutorSelections:
    css: '.exercise-summary .tutor-selections h2'

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

  selectExercises: (numExercises) ->
    _.times numExercises, =>
      @el.inactiveExerciseCard.click()
      @_test.sleep(500) # Wait for exercise to get selected

  startReview: () ->
    @el.reviewExercisesButton.click()


class HomeworkBuilder extends TestHelper
  constructor: (test, testElementLocator) ->
    testElementLocator ?= css: '.task-plan.homework-plan'
    super test, testElementLocator, COMMON_ELEMENTS, defaultWaitTime: 3000
    @setCommonHelper('selectReadingsList', new SelectReadingsList(@test))
    @setCommonHelper('exerciseSelector', new ExerciseSelector(@test, COMMON_ELEMENTS.addExercisesContainer))
    @setCommonHelper('unsavedDialog', new UnsavedDialog(@test))

  openSelectSections: ->
    @el.selectProblemsBtn.click()

  addSections: (sections=[1.1, 1.2, 2.1, 3, 3.1]) ->
    @el.selectReadingsList.waitUntilLoaded(4000)
    @el.selectReadingsList.selectSections(sections)

  addExercises: (numExercises=4) ->
    @el.showProblemsBtn.click()
    @el.exerciseSelector.waitUntilLoaded()
    @el.exerciseSelector.selectExercises(numExercises)

  startReview: () ->
    @el.exerciseSelector.startReview()
    @test.utils.wait.for(css: '.exercise-table')

  verifySelectedExercises: (numExercises) ->

    @el.selectedExercises.findElements().then (els) ->
      expect(numExercises).to.be.equal(els.length)

    @el.numExercisesSelected.findElement().getText().then (text) ->
      expect(numExercises).to.be.equal(parseInt(text))

  addTutorSelection: () ->
    @el.addTutorSelection.click()

  removeTutorSelection: () ->
    @el.removeTutorSelection.click()

  verifyTutorSelection: (num) ->
    @el.tutorSelections.findElement().getText().then (text) ->
      expect(num).to.be.equal(parseInt(text))

  closeBuilder: () ->
    @test.utils.windowPosition.scrollTop()

    @el.closeButton.click()
    @el.unsavedDialog.close()
    Calendar.verify(@test)



module.exports = HomeworkBuilder
