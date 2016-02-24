selenium = require 'selenium-webdriver'
Calendar = require './calendar'
{TestHelper} = require './test-element'

COMMON_ELEMENTS =
  name:
    css: '#reading-title'
  datepickerContainer:
    css: '.datepicker__container'
  dateInput: (type) ->
    css: ".-assignment-#{type}-date .datepicker__input"
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

  selectReadingsButton:
    css: '#reading-select'
  addReadingsButton:
    css: '.dialog:not(.hide) .-show-problems:not([disabled])'
  disabledAddReadingsButton:
    css: '.dialog:not(.hide) .-show-problems[disabled]'

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


COMMON_ELEMENTS.anyPlan =
  css: "#{COMMON_ELEMENTS.readingPlan.css}, #{COMMON_ELEMENTS.homeworkPlan.css}, #{COMMON_ELEMENTS.externalPlan.css}"


OPENED_PANEL_SELECTOR = '.dialog:not(.hide)'

COMMON_SELECT_READING_ELEMENTS =
  sectionItem: (section) ->
    css: "#{OPENED_PANEL_SELECTOR} [data-chapter-section='#{section}']"
  chapterHeadingSelectAll: (section) ->
    css: "#{OPENED_PANEL_SELECTOR} [data-chapter-section='#{section.split('.')[0]}'] .chapter-checkbox input"
  chapterHeading: (section) ->
    css: "#{OPENED_PANEL_SELECTOR} [data-chapter-section='#{section.split('.')[0]}'] > a"


COMMON_UNSAVED_DIALOG_ELEMENTS =
  dismissButton:
    css: '.-tutor-dialog-parent .tutor-dialog.modal.fade.in .modal-footer .ok.btn'


class SelectReadingsList extends TestHelper
  constructor: (test, testElementLocator) ->
    testElementLocator ?= css: ".select-reading-dialog#{OPENED_PANEL_SELECTOR}"
    super test, testElementLocator, COMMON_SELECT_READING_ELEMENTS, loadingLocator: css: '.select-reading-dialog.hide'

  selectSection: (section) =>
    # Selecting an entire chapter requires clicking the input box
    # So handle chapters differently
    isChapter = not /\./.test(section)
    if isChapter
      @el.chapterHeadingSelectAll(section).click()
    else
      # BUG? Hidden dialogs remain in the DOM. When searching make sure it is in a dialog that is not hidden
      @el.sectionItem(section).findElement().isDisplayed().then (isDisplayed) =>
        # Expand the chapter accordion if necessary
        unless isDisplayed
          @el.chapterHeading(section).click()

        @el.sectionItem(section).click()


# TODO could probably make this a general dialog/modal helper to extend from.
class UnsavedDialog extends TestHelper
  constructor: (test, testElementLocator) ->
    testElementLocator ?= css: '.tutor-dialog.modal'
    super test, testElementLocator, COMMON_UNSAVED_DIALOG_ELEMENTS, loadingLocator: css: '.tutor-dialog.modal.fade:not(.in)'

  waitUntilClose: =>
    @test.driver.wait =>
      @isPresent().then (isPresent) -> not isPresent

  close: =>
    @isPresent().then (modalIsOpened) =>
      return unless modalIsOpened

      @waitUntilLoaded()
      @el.dismissButton.click()
      @waitUntilClose()


# Helper methods for dealing with the Reading Assignment Builder
# TODO this could probably be made into a BuilderHelper that extends the TestHelper
# and then the ReadingBuilder and HomeworkBuilder can extend the BuilderHelper
class ReadingBuilder extends TestHelper

  constructor: (test, testElementLocator) ->
    testElementLocator ?= css: '.task-plan.reading-plan'
    super test, testElementLocator, COMMON_ELEMENTS
    @setCommonHelper('selectReadingsList', new SelectReadingsList(@test))
    @setCommonHelper('unsavedDialog', new UnsavedDialog(@test))

  waitUntilLoaded: (ms) =>
    super(ms)
    @test.driver.wait =>
      @el.anyPlan.isPresent()

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
      @el.datepickerContainer.isPresent().then (isPresent) -> not isPresent

  setName: (name) =>
    @el.name.get().sendKeys(name)

  getNameValue: =>
    @el.name.get().getAttribute('value')

  openSelectReadingList: =>
    @el.selectReadingsButton.click()
    @el.selectReadingsList.waitUntilLoaded()

  hasError: (type) =>
    @el.hasErrorWarning(type).get().isDisplayed()

  hasRequiredHint: (type) =>
    @el.requiredHint(type).get().isDisplayed()

  hasRequiredMessage: (type) =>
    @el.requiredItemNotice(type).get().isDisplayed()

  publish: (name) =>
    @el.publishButton.waitClick()

    # Wait up to 4min for publish to complete (Local, synchronous publish)
    @test.utils.wait.giveTime (4 * 60 * 1000), =>
      # wait for
      @test.driver.wait =>
        @el.pendingPublishButton.isPresent().then (isPresent) -> not isPresent

    # Wait up to 2min for publish to complete (Remote, asynchronous publish)
    @test.utils.wait.giveTime (2 * 60 * 1000), =>
      # Publishing can be async so wait until the assignment shows up as 'published' in the calendar
      # Added here because folks won't remember to wait for this
      (new Calendar(@test)).waitUntilPublishingFinishedByTitle(name)

  save: =>
    @test.utils.wait.giveTime (2 * 60 * 1000), =>
      @el.saveButton.waitClick()

  cancel: =>
    # BUG: "X" close button behaves differently than the footer close button
    @el.cancelButton.click()
    # BUG: Should not prompt when canceling
    # Confirm the "Unsaved Changes" dialog
    @el.unsavedDialog.close()
    Calendar.verify(@test)

  delete: =>
    # Wait up to 2min for delete to complete
    @test.utils.wait.giveTime (2 * 60 * 1000), =>
      @el.deleteButton.waitClick()
      # Accept the browser confirm dialog
      @test.driver.wait(selenium.until.alertIsPresent()).then (alert) ->
        alert.accept()

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
  edit: ({name, description, opensAt, dueAt, sections, action, verifyAddReadingsDisabled}) ->
    # Just confirm the plan is actually open
    # Under selenium, a seemingly invisible .is-loading element is present and
    # hangs around for quite awhile.  Bump the wait time up to 4 seconds to work around
    @waitUntilLoaded(4000)
    @setName(name) if name
    @setDate({opensAt, dueAt}) if opensAt or dueAt

    if sections
      # Open the chapter list by clicking the button and waiting for the list to load
      @openSelectReadingList()
      # Make sure nav bar does not cover buttons
      @test.utils.windowPosition.scrollTop()

      # Expand the chapter and then select the section
      for section in sections
        do (section) =>
          section = "#{section}" # Ensure the section is a string so we can split it
          @el.selectReadingsList.selectSection(section)

      if verifyAddReadingsDisabled
        # Verify "Add Readings" is disabled and click Cancel
        @el.disabledAddReadingsButton.isPresent().then (isDisplayed) =>
          @cancel() if isDisplayed
      else
        # Click "Add Readings"
        @test.sleep(1500, 'about to click Add Readings Button') # Not sure why this is needed
        @el.addReadingsButton.waitClick()

    switch action
      when 'PUBLISH' then @publish(name)
      when 'SAVE' then @save()
      when 'CANCEL' then @cancel()
      when 'DELETE' then @delete()


module.exports = ReadingBuilder
