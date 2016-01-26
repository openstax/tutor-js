selenium = require 'selenium-webdriver'
Calendar = require './calendar'
SelectReadings = require './select-readings-dialog'

# Helper methods for dealing with the Reading Assignment Builder

# Helper for setting a date in the date picker
setDate = (test, css, date) ->
  test.driver.findElement(css: "#{css} .datepicker__input").click()
  switch date
    when 'TODAY'
      test.waitClick(css: '.datepicker__container .datepicker__month .datepicker__day.datepicker__day--today')
    when 'NOT_TODAY'
      test.waitClick(css: '.datepicker__container .datepicker__month .datepicker__day:not(.datepicker__day--disabled):not(.datepicker__day--today)')
      # TODO: May need to click on next month
    when 'EARLIEST'
      test.waitClick(css: '.datepicker__container .datepicker__month .datepicker__day:not(.datepicker__day--disabled)')
      # TODO: May need to click on next month
    else throw new Error("BUG: Invalid date: '#{date}'")

  # Wait until the modal closes after clicking the date
  test.driver.wait =>
    test.driver.isElementPresent(css: '.datepicker__container').then (isPresent) -> not isPresent

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
edit = (test, {name, description, opensAt, dueAt, sections, action, verifyAddReadingsDisabled}) =>
  # Just confirm the plan is actually open
  test.waitAnd(css: '.reading-plan, .homework-plan, .external-plan')

  if name
    test.waitAnd(css: '#reading-title').sendKeys(name)
  if opensAt
    setDate(test, '.-assignment-open-date', opensAt)
  if dueAt
    setDate(test, '.-assignment-due-date', dueAt)
  if sections
    # Open the chapter list by clicking the button and waiting for the list to load
    test.driver.findElement(css: '#reading-select').click()
    SelectReadings(test, sections)

    if verifyAddReadingsDisabled
      # Verify "Add Readings" is disabled and click Cancel
      test.waitAnd(css: '.dialog:not(.hide) .-show-problems[disabled]')
      test.waitClick(css: '.dialog:not(.hide) .panel-footer [aria-role="close"]')
      # Confirm the "Unsaved Changes" dialog
      test.waitClick(css: '.-tutor-dialog-parent .tutor-dialog.modal.fade.in .modal-footer .ok.btn')
      test.sleep(1000) # Wait for dialog to close
    else
      # Click "Add Readings"
      test.waitClick(css: '.-show-problems') # BUG: wrong class name

  switch action
    when 'PUBLISH'
      # Wait up to 3min for publish to complete
      test.waitClick(css: '.async-button.-publish')
      Calendar.verify(test, 3 * 60 * 1000)

    when 'SAVE' then test.waitClick(css: '.async-button.-save')
    when 'CANCEL'
      # BUG: "X" close button behaves differently than the footer close button
      test.waitClick(css: '.footer-buttons [aria-role="close"]')
      test.sleep(1000) # Wait for dialog to close
      Calendar.verify(test)

    when 'DELETE'
      # Wait up to 60sec for delete to complete
      test.waitClick(css: '.async-button.delete-link')
      # Accept the browser confirm dialog
      test.driver.wait(selenium.until.alertIsPresent()).then (alert) ->
        alert.accept()

      Calendar.verify(test, 60 * 1000)


module.exports = {setDate, edit}
