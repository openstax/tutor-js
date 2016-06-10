selenium = require 'selenium-webdriver'
_ = require 'underscore'
Calendar = require './calendar'
{TestHelper} = require './test-element'
ExerciseSelector = require './exercise-selector'

COMMON_ELEMENTS =
  name:
    css: '#reading-title'
  datepickerContainer:
    css: '.datepicker__container'
  dateInput: (type) ->
    css: ".-assignment-#{type}-date .datepicker__input-container input"
  datepickerDay: (dayDescription) ->
    dayDescriptor = switch dayDescription
      when 'TODAY'
        '.datepicker__day--today'
      when 'NOT_TODAY'
        ':not(.datepicker__day--disabled):not(.datepicker__day--today)'
      when 'EARLIEST'
        ':not(.datepicker__day--disabled)'
        # TODO: May need to click on next month
      else throw new Error("BUG: Invalid date: '#{dayDescription}'")

    css: ".datepicker__container .datepicker__month .datepicker__day#{dayDescriptor}"

  readingPlan:
    css: '.reading-plan'
  homeworkPlan:
    css: '.homework-plan'
  externalPlan:
    css: '.external-plan'
  eventPlan:
    css: '.event-plan'

  selectSectionsButton:
    css: '.-select-sections-btn'
  addReadingsButton:
    css: '.dialog:not(.hide) .-show-problems:not([disabled])'
  disabledAddReadingsButton:
    css: '.dialog:not(.hide) .-show-problems[disabled]'

  selectProblemsBtn:
    css: '#problems-select'
  selectedExercises:
    css: '.openstax.exercise-wrapper .is-selected'
  numExercisesSelected:
    css: '.exercise-summary .num-selected h2'

  tutorSelections:
    css: '.exercise-summary .tutor-selections h2'
  addTutorSelection:
    css: '.exercise-summary .tutor-selections .btn.-move-exercise-up'
  removeTutorSelection:
    css: '.exercise-summary .tutor-selections .btn.-move-exercise-down'

  deleteButton:
    css: '.dialog:not(.hide) .async-button.delete-link'
  saveButton:
    css: '.dialog:not(.hide) .async-button.-save'
  publishButton:
    css: '.dialog:not(.hide) .async-button.-publish'
  pendingPublishButton:
    css: '.dialog:not(.hide) .async-button.-publish.is-waiting'
  cancelButton:
    css: '.dialog:not(.hide) .panel-footer [aria-role="close"]'
  feedbackSelection:
    css: '#feedback-select'

  hasErrorWarning: (type) ->
    typeClass = switch type
      when 'ASSIGNMENT_NAME'
        '.assignment-name'
      when 'EXTERNAL_URL'
        '.external-url'
      else
        type

    css: "#{typeClass}.has-error"

  requiredHint: (type) ->
    typeClass = switch type
      when 'DUE_DATE'
        '.-assignment-due-date'
      else
        type

    css: "#{typeClass}  .form-control.empty ~ .required-hint"

  requiredItemNotice: (type) ->
    typeClass = switch type
      when 'READINGS'
        'readings'
      when 'PROBLEMS'
        'problems'
      else
        type

    css: ".#{typeClass}-required"

planLocators = [COMMON_ELEMENTS.readingPlan, COMMON_ELEMENTS.homeworkPlan, COMMON_ELEMENTS.externalPlan, COMMON_ELEMENTS.eventPlan]

anyBuilderLocator = _.map(planLocators, (planLocator) ->
  ".task-plan#{planLocator.css}"
).join(', ')

COMMON_ELEMENTS.anyPlan =
  css: anyBuilderLocator


OPENED_PANEL_SELECTOR = '.dialog:not(.hide)'

COMMON_SELECT_READING_ELEMENTS =
  loadingState:
    css: '.select-reading-dialog.hide'
  sectionItem: (section) ->
    css: "#{OPENED_PANEL_SELECTOR} [data-chapter-section='#{section}']"
  chapterHeadingSelectAll: (section) ->
    css: "#{OPENED_PANEL_SELECTOR} [data-chapter-section='#{section.split('.')[0]}'] .chapter-checkbox .tri-state-checkbox"
  chapterHeading: (section) ->
    css: "#{OPENED_PANEL_SELECTOR} [data-chapter-section='#{section.split('.')[0]}'] > a"

COMMON_DELETE_CONFIRM_ELEMENTS =
  confirm:
    css: '.btn.btn-primary'
  cancel:
    css: '.btn.btn-default'

COMMON_UNSAVED_DIALOG_ELEMENTS =
  loadingState:
    css: '.tutor-dialog.modal.fade:not(.in)'
  dismissButton:
    css: '.tutor-dialog.modal.fade.in .modal-footer .ok.btn'


class SelectReadingsList extends TestHelper
  constructor: (test, testElementLocator) ->
    testElementLocator ?= css: ".select-reading-dialog#{OPENED_PANEL_SELECTOR}"
    super test, testElementLocator, COMMON_SELECT_READING_ELEMENTS

  selectSection: (section) =>
    # Selecting an entire chapter requires clicking the input box
    # So handle chapters differently
    isChapter = not /\./.test(section)
    if isChapter
      @el.chapterHeadingSelectAll(section).waitClick()
    else
      # BUG? Hidden dialogs remain in the DOM. When searching make sure it is in a dialog that is not hidden
      @el.sectionItem(section).findElement().isDisplayed().then (isDisplayed) =>
        # Expand the chapter accordion if necessary
        unless isDisplayed
          @el.chapterHeading(section).waitClick()

        @el.sectionItem(section).waitClick()

class DeleteConfirmPopover extends TestHelper
  constructor: (test, testElementLocator) ->
    testElementLocator ?= css: '.popover.openstax-surety-guard'
    super test, testElementLocator, COMMON_DELETE_CONFIRM_ELEMENTS

  confirm: =>
    @el.self().isPresent().then (popoverIsOpen) =>
      return unless popoverIsOpen
      @waitUntilLoaded()
      @el.confirm().click()
      @waitUntilClose()

  waitUntilClose: =>
    @test.driver.wait =>
      @el.self().isPresent().then (isPresent) -> not isPresent


# TODO could probably make this a general dialog/modal helper to extend from.
class UnsavedDialog extends TestHelper
  constructor: (test, testElementLocator) ->
    testElementLocator ?= css: '.tutor-dialog.modal'
    super test, testElementLocator, COMMON_UNSAVED_DIALOG_ELEMENTS

  waitUntilClose: =>
    @test.driver.wait =>
      @el.self().isPresent().then (isPresent) -> not isPresent

  close: =>
    @el.self().isPresent().then (modalIsOpened) =>
      return unless modalIsOpened

      @waitUntilLoaded()
      @el.dismissButton().click()
      @waitUntilClose()

# Helper methods for dealing with the Reading Assignment Builder
# TODO this could probably be made into a BuilderHelper that extends the TestHelper
# and then the TaskBuilder and HomeworkBuilder can extend the BuilderHelper
class TaskBuilder extends TestHelper

  constructor: (test, testElementLocator) ->
    testElementLocator ?= COMMON_ELEMENTS.anyPlan
    super test, testElementLocator, COMMON_ELEMENTS
    # todo look at making these accessible as functions as well
    @setCommonHelper('selectReadingsList', new SelectReadingsList(@test))
    @setCommonHelper('deleteConfirmation', new DeleteConfirmPopover(@test))
    @setCommonHelper('unsavedDialog', new UnsavedDialog(@test))
    @setCommonHelper('exerciseSelector', new ExerciseSelector(@test))

  # Helper for setting a date in the date picker
  # where
  #   type is open or due and
  #   date is TODAY, NOT_TODAY, or EARLIEST
  _setDate: (type, date) =>
    @openDatePicker(type)
    @chooseDate(date)

    # Wait until the modal closes after clicking the date
    @waitUntilDatepickerClosed()

  setDate: ({opensAt, dueAt}) =>
    if opensAt
      @_setDate('open', opensAt)
    if dueAt
      @_setDate('due', dueAt)

  openDatePicker: (type) =>
    @el.dateInput(type).click()

  chooseDate: (date) =>
    @el.datepickerDay(date).click()

  waitUntilDatepickerClosed: =>
    @test.driver.wait =>
      @el.datepickerContainer().isPresent().then (isPresent) -> not isPresent

  setName: (name) =>
    @el.name().get().sendKeys(name)

  isFeedbackImmediate: ->
    @el.feedbackSelection().get().getAttribute('value').then (value)->
      value is 'immediate'

  setFeedbackImmediate: (isFeedbackImmediate) ->
    @el.feedbackSelection().get().sendKeys(if isFeedbackImmediate then 'i' else 'o')

  getNameValue: =>
    @el.name().get().getAttribute('value')

  openSelectReadingList: =>
    @el.selectSectionsButton().click()
    @el.selectReadingsList.waitUntilLoaded()

  hasError: (type) =>
    @el.hasErrorWarning(type).get().isDisplayed()

  hasRequiredHint: (type) =>
    @el.requiredHint(type).get().isDisplayed()

  hasRequiredMessage: (type) =>
    @el.requiredItemNotice(type).get().isDisplayed()

  publish: (name) =>
    @el.publishButton().waitClick()

    # Wait up to 4min for publish to complete (Local, synchronous publish)
    @test.utils.wait.giveTime (4 * 60 * 1000), =>
      # wait for
      @test.driver.wait =>
        @el.pendingPublishButton().isPresent().then (isPresent) -> not isPresent

    # Wait up to 2min for publish to complete (Remote, asynchronous publish)
    @test.utils.wait.giveTime (2 * 60 * 1000), =>
      # Publishing can be async so wait until the assignment shows up as 'published' in the calendar
      # Added here because folks won't remember to wait for this
      (new Calendar(@test)).waitUntilPublishingFinishedByTitle(name)

  save: =>
    @test.utils.wait.giveTime (2 * 60 * 1000), =>
      @el.saveButton().waitClick()

  cancel: =>
    # BUG: "X" close button behaves differently than the footer close button
    @el.cancelButton().click()
    # BUG: Should not prompt when canceling
    # Confirm the "Unsaved Changes" dialog
    @el.unsavedDialog.close()

  selectNumberOfExercises: (numExercises) ->
    @el.exerciseSelector.selectNumberOfExercises(numExercises)

  countSelectedExercises: ->
    @el.numExercisesSelected().findElement().getText().then (text) ->
      parseInt(text)

  countTutorSelection: ->
    @el.tutorSelections().findElement().getText().then (text) ->
      parseInt(text)

  startReview: ->
    @el.exerciseSelector.startReview()
    @test.utils.wait.for(css: '.exercise-table')

  addTutorSelection: () ->
    @el.addTutorSelection().waitClick()

  removeTutorSelection: () ->
    @el.removeTutorSelection().waitClick()

  delete: =>
    # Wait up to 2min for delete to complete
    @el.deleteButton().waitClick(2 * 60 * 1000)
    # Accept the browser confirm dialog
    @el.deleteConfirmation.waitUntilLoaded()
    @el.deleteConfirmation.confirm()
    Calendar.verify(@test, 2 * 60 * 100)


  #   name
  #   description
  #   type: 'READING', 'HOMEWORK', 'EXTERNAL'
  #   opensAt: 'TODAY', 'NOT_TODAY', 'EARLIEST'
  #   dueAt: 'TODAY', 'NOT_TODAY', 'EARLIEST'
  #   periodDates: [
  #     null
  #     {opensAt: 'TODAY', dueAt: 'TODAY'}
  #   ]
  #   sections: ['1.1', '2.4']
  #   action: 'PUBLISH', 'SAVE', 'DELETE', 'CANCEL', 'X_BUTTON'
  edit: ({name, description, opensAt, dueAt, sections, action, numExercises, isFeedbackImmediate, verifyAddReadingsDisabled}) ->
    # Just confirm the plan is actually open
    # Under selenium, a seemingly invisible .is-loading element is present and
    # hangs around for quite awhile.  Bump the wait time up to 4 seconds to work around
    @waitUntilLoaded(4000)
    @setName(name) if name
    @setDate({opensAt, dueAt}) if opensAt or dueAt
    @setFeedbackImmediate(isFeedbackImmediate) if isFeedbackImmediate?
    if sections
      # Open the chapter list by clicking the button and waiting for the list to load
      @openSelectReadingList()

      # Expand the chapter and then select the section
      for section in sections
        do (section) =>
          section = "#{section}" # Ensure the section is a string so we can split it
          @el.selectReadingsList.selectSection(section)

      if verifyAddReadingsDisabled
        # Verify "Add Readings" is disabled and click Cancel
        @el.disabledAddReadingsButton().isPresent().then (isDisplayed) =>
          @cancel() if isDisplayed
      else
        # Click "Add Readings"
        # @test.sleep(1500, 'about to click Add Readings Button') # Not sure why this is needed
        @el.addReadingsButton().waitClick()

    if numExercises
      @selectNumberOfExercises(numExercises) #add exercises
      @startReview() #start review

    switch action
      when 'PUBLISH' then @publish(name)
      when 'SAVE' then @save()
      when 'CANCEL' then @cancel()
      when 'DELETE' then @delete()


module.exports = TaskBuilder
