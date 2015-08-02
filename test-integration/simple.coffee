# Runs some selenium tests that create an iReading (saves screenshot on failure). Mostly just playing around with Selenium to get feedback. The actual test code is in `simple.coffee`
#
# # Instructions
#
# 1. `npm install -g mocha`
# 2. `npm install` (to get the new packages)
# 3. `mocha ./test-integration/simple.coffee --compilers coffee-script/register`
#
# TODO:
#
# - [ ] Abstract reading creation so it can be used for "Save Draft", "Publish" and partial completion

{describe} = require './helper'
selenium = require 'selenium-webdriver'
{expect} = require 'chai'

SERVER_URL = process.env['SERVER_URL'] or 'http://localhost:3001/'
TEACHER_USERNAME = 'teacher01'




describe 'Smoke Tests', ->


  @__it 'Logs in and publishes a Bio Reading', ->
    @timeout 10 * 60 * 1000 # ~4 min to publish (plus mathjax CDN)

    @driver.get SERVER_URL
    # @screenshot(@driver, 'debugging-snapshot.png')

    unique = "#{new Date()}"
    # TODO: escape arbitrary title quotes with &quote; or `\'`
    title = "Test Reading Title: #{unique}"

    loginDev = (username) =>
      @driver.findElement(linkText: 'Login').click()
      @driver.wait selenium.until.elementLocated(css: '#search_query')

      # Log in as teacher
      @driver.findElement(css: '#search_query').sendKeys(username)
      @driver.findElement(css: '#search_query').submit()

      @waitClick(linkText: username)

      # Verify React loaded
      @driver.wait selenium.until.elementLocated(css: '#react-root-container')

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



    loginDev(TEACHER_USERNAME)

    # Go to the bio dashboard
    @waitClick(css: '[data-category="biology"]')

    @waitClick(css: '.add-assignment .dropdown-toggle')
    @waitClick(linkText: 'Add Reading')

    @waitAnd(css: '#reading-title').sendKeys(title)

    # Set the open date to today (It should already be selected)
    # setDate('.-assignment-open-date', true)

    # Set the due Date to after today
    # BUG: Don't click on today
    setDate('.-assignment-due-date', false)

    # Select Readings
    # Open the chapter list
    @driver.findElement(css: '#reading-select').click()

    # Select the 1st chapter
    @waitClick(css: '.select-reading-chapters .chapter-checkbox input')

    # Expand the chapter and then select the section
    @waitClick(css: "[data-chapter-section='2']")
    @waitClick(css: "[data-chapter-section='2.1']")

    # Click "Add Readings"
    @waitClick(css: '.-show-problems') # BUG: wrong class name

    # Save as Draft
    # @waitClick(css: '.async-button.-publish')
    @waitClick(css: '.async-button.-save')

    # Open it in the Calendar (verify it was added)
    # BUG: .course-list shouldn't be in the DOM
    @driver.wait selenium.until.elementLocated(css: '.calendar-container')

    @waitClick(css: "[data-title='#{title}']")

    # Idea for taking the code above and turning it all into a helper.
    #
    # publishNewReading = () =>
    #   name
    #   description
    #   opensAt: 'TODAY', 'NOT_TODAY'
    #   dueAt: 'TODAY', 'NOT_TODAY'
    #   periodDates: [
    #     null
    #     {opensAt: 'TODAY', dueAt: 'TODAY'}
    #   ]
    #   sections: ['1.1', '2.4']
    #   action: 'PUBLISH', 'SAVE_DRAFT', 'DELETE', 'CANCEL', 'X_BUTTON'
