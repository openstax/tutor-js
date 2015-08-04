{describe} = require './helper'
selenium = require 'selenium-webdriver'
{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'



# -----------------------------
# Start the test
# -----------------------------


describe 'Assignment Creation Tests', ->

  @before ->
    # -----------------------------
    # Test helper functions
    # -----------------------------

    # Helper for setting a date in the date picker
    @setDate = (css, date) =>
      @driver.findElement(css: "#{css} .datepicker__input").click()
      switch date
        when 'TODAY'
          @waitClick(css: '.datepicker__container .datepicker__month .datepicker__day.datepicker__day--today')
        when 'NOT_TODAY'
          @waitClick(css: '.datepicker__container .datepicker__month .datepicker__day:not(.datepicker__day--disabled):not(.datepicker__day--today)')
          # TODO: May need to click on next month
        when 'EARLIEST'
          @waitClick(css: '.datepicker__container .datepicker__month .datepicker__day:not(.datepicker__day--disabled)')
          # TODO: May need to click on next month
        else throw new Error("BUG: Invalid date: '#{date}'")

      # Wait until the modal closes after clicking the date
      @driver.wait =>
        @driver.isElementPresent(css: '.datepicker__container').then (isPresent) -> not isPresent

    #   name
    #   description
    #   opensAt: 'TODAY', 'NOT_TODAY', 'EARLIEST'
    #   dueAt: 'TODAY', 'NOT_TODAY', 'EARLIEST'
    #   periodDates: [
    #     null
    #     {opensAt: 'TODAY', dueAt: 'TODAY'}
    #   ]
    #   sections: ['1.1', '2.4']
    #   action: 'PUBLISH', 'SAVE', 'DELETE', 'CANCEL', 'X_BUTTON'
    @editReading = ({name, description, opensAt, dueAt, sections, action}) =>
      @waitAnd(css: '.reading-plan') # Just confirm the plan is actually open

      if name
        @waitAnd(css: '#reading-title').sendKeys(name)
      if opensAt
        @setDate('.-assignment-open-date', opensAt)
      if dueAt
        @setDate('.-assignment-due-date', dueAt)
      if sections
        # Open the chapter list by clicking the button and waiting for the list to load
        @driver.findElement(css: '#reading-select').click()
        @waitAnd(css: '.select-reading-dialog')

        # Expand the chapter and then select the section
        for section in sections
          do (section) =>
            section = "#{section}" # Ensure the section is a string so we can split it

            # Selecting an entire chapter requires clicking the input box
            # So handle chapters differently
            if /\./.test(section)
              @driver.findElement(css: "[data-chapter-section='#{section}']").isDisplayed().then (isVisible) =>
                # Expand the chapter accordion if necessary
                unless isVisible
                  @waitClick(css: "[data-chapter-section='#{section.split('.')[0]}']")

                @waitClick(css: "[data-chapter-section='#{section}']")
            else
              @waitClick(css: "[data-chapter-section='#{section}'] .chapter-checkbox input")

        # Click "Add Readings"
        @waitClick(css: '.-show-problems') # BUG: wrong class name

      switch action
        when 'PUBLISH' then @waitClick(css: '.async-button.-publish')
        when 'SAVE' then @waitClick(css: '.async-button.-save')
        when 'DELETE'
          @waitClick(css: '.async-button.delete-link')
          # Accept the browser confirm dialog
          @driver.wait(selenium.until.alertIsPresent()).then (alert) ->
            alert.accept()


  @it 'Creates a Bio draft Reading with opensAt to today and deletes', ->
    @timeout 30 * 1000 # ~30 sec to create and delete a draft (plus mathjax CDN)

    # @screenshot('debugging-snapshot.png')

    title = "Test: #{@freshId()}"

    @loginDev(TEACHER_USERNAME)

    # Go to the bio dashboard
    @waitClick(css: '[data-category="biology"]')

    @waitClick(css: '.add-assignment .dropdown-toggle')
    @waitClick(linkText: 'Add Reading')

    @editReading
      name: title
      # opensAt: 'NOT_TODAY'
      dueAt: 'EARLIEST'
      sections: [1.1, 1.2, 2.1, 3]
      action: 'SAVE'

    # Wait until the Calendar loads back up
    # And then verify it was added by clicking on it again
    # BUG: .course-list shouldn't be in the DOM
    @waitAnd(css: '.calendar-container')
    @waitClick(css: "[data-title='#{title}']")

    @editReading(action: 'DELETE')
    @waitAnd(css: '.calendar-container')


  @it 'Shows Validation Error when saving a blank Reading', ->
    @timeout 2 * 60 * 1000

    title = "Test: #{@freshId()}"

    @loginDev(TEACHER_USERNAME)

    # Go to the bio dashboard
    @waitClick(css: '[data-category="biology"]')

    @waitClick(css: '.add-assignment .dropdown-toggle')
    @waitClick(linkText: 'Add Reading')

    @editReading
      action: 'SAVE'

    @waitAnd(css: '.assignment-name.has-error .required-hint')
    .isDisplayed().then (isDisplayed) ->
      expect(isDisplayed).to.be.true

    @waitAnd(css: '.-assignment-due-date .form-control.empty ~ .required-hint')
    .isDisplayed().then (isDisplayed) ->
      expect(isDisplayed).to.be.true

    @waitAnd(css: '.readings-required').isDisplayed().then (isDisplayed) ->
      expect(isDisplayed).to.be.true


  @xit 'Publishes a Reading with opensAt to tomorrow and deletes', ->
    @timeout 10 * 60 * 1000 # ~4min to publish a draft (plus mathjax CDN)

    title = "Test: #{@freshId()}"

    @loginDev(TEACHER_USERNAME)

    # Go to the bio dashboard
    @waitClick(css: '[data-category="biology"]')

    @waitClick(css: '.add-assignment .dropdown-toggle')
    @waitClick(linkText: 'Add Reading')

    @editReading
      name: title
      opensAt: 'NOT_TODAY'
      dueAt: 'EARLIEST'
      sections: [1.2]
      action: 'PUBLISH'

    # Wait until the Calendar loads back up
    # And then verify it was added by clicking on it again
    # BUG: .course-list shouldn't be in the DOM
    @waitAnd(css: '.calendar-container')
    @waitClick(css: "[data-title='#{title}']")

    # Since the Assignment has not been opened yet there is no "Edit Assignment"
    @waitAnd(css: '.-edit-assignment, .reading-plan')
    # If there is a popup then click the "Edit" button
    @driver.isElementPresent(css: '.-edit-assignment').then (isPresent) =>
      if isPresent
        @waitClick(css: '.-edit-assignment')

    @editReading(action: 'DELETE')
    @waitAnd(css: '.calendar-container')
