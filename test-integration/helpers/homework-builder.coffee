_ = require 'underscore'
{expect} = require 'chai'
selenium = require 'selenium-webdriver'

SelectReadings = require './select-readings-dialog'
Calendar = require './calendar'

HomeworkBuilder =
  addSections: (test, sections=[1.1, 1.2, 2.1, 3, 3.1]) ->
    test.waitClick(css: '#problems-select')
    SelectReadings(test, sections)

  addExercises: (test, numExercises=4) ->
    test.waitClick(css: '.homework-plan-exercise-select-topics button.-show-problems')
    test.waitAnd(css: '.add-exercise-list')

    _.times numExercises, ->
      test.waitClick(css: '.card.exercise.panel.panel-default')
      test.sleep(500) # Wait for exercise to get selected

  startReview: (test) ->
    test.waitClick(css: '.exercise-summary .btn.-review-exercises')
    test.waitAnd(css: '.exercise-table')

  verifySelectedExercises: (test, numExercises) ->
    test.driver.findElements(css: '.card.exercise.panel').then (els) ->
      expect(numExercises).to.be.equal(els.length)

    numSelected = test.driver.findElement(css: '.exercise-summary .num-selected h2')

    numSelected.getText().then (text) ->
      expect(numExercises).to.be.equal(parseInt(text))

  addTutorSelection: (test) ->
    test.waitClick(css: '.exercise-summary .tutor-selections .btn.-move-exercise-up')
    test.sleep(500) # Wait for tutor selection to change

  removeTutorSelection: (test) ->
    test.waitClick(css: '.exercise-summary .tutor-selections .btn.-move-exercise-down')
    test.sleep(500) # Wait for tutor selection to change

  verifyTutorSelection: (test, num) ->
    numSelected = test.driver.findElement(css: '.exercise-summary .tutor-selections h2')
    numSelected.getText().then (text) ->
      expect(num).to.be.equal(parseInt(text))

  closeBuilder: (test) ->
    # Wait up to 60sec for delete to complete
    test.waitClick(css: '.footer-buttons [aria-role="close"]')
    test.waitClick(css: '.-tutor-dialog-parent .tutor-dialog.modal.fade.in .modal-footer .ok.btn')
    test.sleep(500) # Wait for tutor selection to change
    Calendar.verify(test, 60 * 1000)



module.exports = HomeworkBuilder
