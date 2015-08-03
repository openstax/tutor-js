{describe} = require './helper'
selenium = require 'selenium-webdriver'
{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'


describe 'Assignment Creation Tests', ->

  @__it 'Creates a draft Bio Reading', ->
    @timeout 10 * 60 * 1000 # ~4 min to publish (plus mathjax CDN)

    # @screenshot('debugging-snapshot.png')

    # -----------------------------
    # Test helper functions
    # -----------------------------

    # Helper for setting a date in the date picker
    setDate = (css, isToday) =>
      @driver.findElement(css: "#{css} .datepicker__input").click()
      if isToday
        @waitClick(css: '.datepicker__container .datepicker__month .datepicker__day.datepicker__day--today')
      else
        @waitClick(css: '.datepicker__container .datepicker__month .datepicker__day:not(.datepicker__day--disabled):not(.datepicker__day--today)')
        # TODO: May need to click on next month
      # Wait until the modal closes after clicking the date
      @driver.wait =>
        @driver.isElementPresent(css: '.datepicker__container').then (isPresent) -> not isPresent

    #   name
    #   description
    #   opensAt: 'TODAY', 'NOT_TODAY'
    #   dueAt: 'TODAY', 'NOT_TODAY'
    #   periodDates: [
    #     null
    #     {opensAt: 'TODAY', dueAt: 'TODAY'}
    #   ]
    #   sections: ['1.1', '2.4']
    #   action: 'PUBLISH', 'SAVE', 'DELETE', 'CANCEL', 'X_BUTTON'
    editReading = ({name, description, opensAt, dueAt, sections, action}) =>
      if name
        @waitAnd(css: '#reading-title').sendKeys(title)
      if opensAt
        setDate('.-assignment-open-date', opensAt is 'TODAY')
      if dueAt
        setDate('.-assignment-due-date', dueAt is 'TODAY')
      if sections
        # Open the chapter list
        @driver.findElement(css: '#reading-select').click()

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


    # -----------------------------
    # Start the test
    # -----------------------------

    # TODO: escape arbitrary title quotes with &quote; or `\'`
    title = "Test Reading Title: #{new Date()}"

    @loginDev(TEACHER_USERNAME)

    # Go to the bio dashboard
    @waitClick(css: '[data-category="biology"]')

    @waitClick(css: '.add-assignment .dropdown-toggle')
    @waitClick(linkText: 'Add Reading')

    editReading
      name: title
      opensAt: 'NOT_TODAY' # null
      dueAt: 'NOT_TODAY'
      sections: [1.1, 1.2, 2.1, 3]
      action: 'SAVE'


    # Wait until the Calendar loads back up
    # And then verify it was added by clicking on it again
    # BUG: .course-list shouldn't be in the DOM
    @waitAnd(css: '.calendar-container')
    @waitClick(css: "[data-title='#{title}']")

    editReading(action: 'DELETE')
