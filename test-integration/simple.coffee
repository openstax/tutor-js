{describe} = require './helper'
selenium = require 'selenium-webdriver'
{expect} = require 'chai'

describe 'Smoke Tests', ->
  @__it 'Logs in and creates a Bio Reading', ->
    @driver.get 'http://localhost:3001/'
    # @screenshot(@driver, 'debugging-snapshot.png')

    unique = "#{new Date()}"
    # TODO: escape arbitrary title quotes with &quote; or `\'`
    title = "Test Reading Title: #{unique}"

    @driver.findElement(linkText: 'Login').click()
    @driver.wait selenium.until.elementLocated(css: '#search_query')

    # Log in as teacher
    @driver.findElement(css: '#search_query').sendKeys('teacher01')
    @driver.findElement(css: '#search_query').submit()

    @waitClick(linkText: 'teacher01')

    # Verify React loaded
    @driver.wait selenium.until.elementLocated(css: '#react-root-container')

    # Go to the bio dashboard
    @waitClick(css: '[data-category="biology"]')

    @waitClick(css: '.add-assignment .dropdown-toggle')
    @waitClick(linkText: 'Add Reading')

    @driver.wait selenium.until.elementLocated(css: '#reading-title')
    @driver.findElement(css: '#reading-title').sendKeys(title)

    # Set the open date to today
    @driver.findElement(css: '.-assignment-open-date .datepicker__input').click()
    @waitClick(css: '.datepicker__container .datepicker__month .datepicker__day.datepicker__day--today')
    # Wait until the modal closes after clicking today
    calendarModal = @driver.findElement(css: '.datepicker__container')
    @driver.wait selenium.until.stalenessOf(calendarModal)

    # Set the due Date to after today
    @driver.findElement(css: '.-assignment-due-date .datepicker__input').click()
    # BUG: Don't click on today
    @waitClick(css: '.datepicker__container .datepicker__month .datepicker__day:not(.datepicker__day--disabled):not(.datepicker__day--today)')
    # Wait until the modal closes after clicking the due date
    calendarModal = @driver.findElement(css: '.datepicker__container')
    @driver.wait selenium.until.stalenessOf(calendarModal)


    # Select Readings
    # Open the chapter list
    @driver.findElement(css: '#reading-select').click()

    @waitClick(css: '.select-reading-chapters .chapter-checkbox input')
    # Click "Add Readings"
    @waitClick(css: '.-show-problems') # Bug: wrong class name

    @waitClick(css: '.-publish')

    # BUG: .course-list shouldn't be in the DOM
    @driver.wait selenium.until.elementLocated(css: '.calendar-container')

    @waitClick(css: "[data-title='#{title}']")

    @waitClick(css: "sjkhdfkjsdhfkjsdhf")
