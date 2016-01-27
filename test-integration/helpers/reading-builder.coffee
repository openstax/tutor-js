selenium = require 'selenium-webdriver'
Calendar = require './calendar'
{TestHelper} = require './test-element'
wait = require './wait'
windowPosition = require './window-position'

  # Helper methods for dealing with the Reading Assignment Builder
class ReadingBuilder extends TestHelper

  constructor: (test) ->
    super test, '.task-plan.reading-plan',
      name:
        locator: {css: '#reading-title'}
        isSingle: true

  # Helper for setting a date in the date picker
  setDate: (css, date) ->
    @test.driver.findElement(css: "#{css} .datepicker__input").click()
    selector = switch date
      when 'TODAY'
        '.datepicker__container .datepicker__month .datepicker__day.datepicker__day--today'
      when 'NOT_TODAY'
        '.datepicker__container .datepicker__month .datepicker__day:not(.datepicker__day--disabled):not(.datepicker__day--today)'
        # TODO: May need to click on next month
      when 'EARLIEST'
        '.datepicker__container .datepicker__month .datepicker__day:not(.datepicker__day--disabled)'
        # TODO: May need to click on next month
      else throw new Error("BUG: Invalid date: '#{date}'")

    wait(@test).click(selector)

    # Wait until the modal closes after clicking the date
    @test.driver.wait =>
      @test.driver.isElementPresent(css: '.datepicker__container').then (isPresent) -> not isPresent

  setName: (name) ->
    @el.name.get().sendKeys(name)

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
    wait(@test).for(css: '.reading-plan, .homework-plan, .external-plan')

    @setName(name) if name

    if opensAt
      @setDate('.-assignment-open-date', opensAt)
    if dueAt
      @setDate('.-assignment-due-date', dueAt)
    if sections
      # Open the chapter list by clicking the button and waiting for the list to load
      @test.driver.findElement(css: '#reading-select').click()
      wait(@test).for(css: '.select-reading-dialog:not(.hide)')
      # Make sure nav bar does not cover buttons
      windowPosition(@test).scrollTop()

      # Expand the chapter and then select the section
      for section in sections
        do (section) =>
          section = "#{section}" # Ensure the section is a string so we can split it

          # Selecting an entire chapter requires clicking the input box
          # So handle chapters differently
          isChapter = not /\./.test(section)
          if isChapter
            wait(@test).click(css: ".dialog:not(.hide) [data-chapter-section='#{section}'] .chapter-checkbox input")
          else
            # BUG? Hidden dialogs remain in the DOM. When searching make sure it is in a dialog that is not hidden
            @test.driver.findElement(css: ".dialog:not(.hide) [data-chapter-section='#{section}']").isDisplayed().then (isDisplayed) =>
              # Expand the chapter accordion if necessary
              unless isDisplayed
                wait(@test).click(css: ".dialog:not(.hide) [data-chapter-section='#{section.split('.')[0]}']")

              wait(@test).click(css: ".dialog:not(.hide) [data-chapter-section='#{section}']")

      if verifyAddReadingsDisabled
        # Verify "Add Readings" is disabled and click Cancel
        wait(@test).for(css: '.dialog:not(.hide) .-show-problems[disabled]')
        wait(@test).click(css: '.dialog:not(.hide) .panel-footer [aria-role="close"]')
        # Confirm the "Unsaved Changes" dialog
        wait(@test).click(css: '.-tutor-dialog-parent .tutor-dialog.modal.fade.in .modal-footer .ok.btn')
        @test.sleep(1000) # Wait for dialog to close
      else
        # Click "Add Readings"
        wait(@test).click(css: '.-show-problems') # BUG: wrong class name

    switch action
      when 'PUBLISH'
        # Wait up to 3min for publish to complete
        wait(@test).click(css: '.async-button.-publish')
        Calendar.verify(@test, 3 * 60 * 1000)

      when 'SAVE' then wait(@test).click(css: '.async-button.-save')
      when 'CANCEL'
        # BUG: "X" close button behaves differently than the footer close button
        wait(@test).click(css: '.footer-buttons [aria-role="close"]')
        # # BUG: Should not prompt when canceling
        # # Confirm the "Unsaved Changes" dialog
        @test.sleep(500) # Wait for unsaved dialog
        unsavedModalOk = '.-tutor-dialog-parent .tutor-dialog.modal.fade.in .modal-footer .ok.btn'
        @test.driver.isElementPresent(css: unsavedModalOk).then (isPresent) =>
          wait(@test).click(css: unsavedModalOk) if isPresent
          @test.sleep(500) # Wait for dialog to close
        Calendar.verify(@test)

      when 'DELETE'
        # Wait up to 60sec for delete to complete
        wait(@test).click(css: '.async-button.delete-link')
        # Accept the browser confirm dialog
        @test.driver.wait(selenium.until.alertIsPresent()).then (alert) ->
          alert.accept()

        Calendar.verify(@test, 60 * 1000)


module.exports = ReadingBuilder
