selenium = require 'selenium-webdriver'
{expect} = require 'chai'

# Make sure the current screen is the calendar
verify = (test) ->
  # wait until the calendar is open
  test.waitAnd(css: '.calendar-container')


# type: 'READING', 'HOMEWORK', 'EXTERNAL'
createNew = (test, type) =>
  verify(test)

  # Click "Add Assignment"
  test.waitClick(css: '.add-assignment .dropdown-toggle')

  # Go to the bio dashboard
  switch type
    when 'READING' then test.waitClick(linkText: 'Add Reading')
    when 'HOMEWORK' then test.waitClick(linkText: 'Add Homework')
    when 'EXTERNAL' then test.waitClick(linkText: 'Add External Assignment')
    else expect(false, 'Invalid assignment type').to.be.true

open = (test, title) ->
  # wait until the calendar is open
  verify(test)
  test.waitClick(css: "[data-title='#{title}']")

module.exports = {verify, createNew, open}
