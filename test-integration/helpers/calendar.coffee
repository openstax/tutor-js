selenium = require 'selenium-webdriver'
{expect} = require 'chai'

# Make sure the current screen is the calendar
verify = (test, ms) ->
  # wait until the calendar is open
  test.waitAnd(css: '.calendar-container:not(.calendar-loading)', ms)


# type: 'READING', 'HOMEWORK', 'EXTERNAL'
createNew = (test, type) ->
  verify(test)

  # Click "Add Assignment"
  test.waitClick(css: '.add-assignment .dropdown-toggle')

  # Go to the bio dashboard
  switch type
    when 'READING' then test.waitClick(linkText: 'Add Reading')
    when 'HOMEWORK' then test.waitClick(linkText: 'Add Homework')
    when 'EXTERNAL' then test.waitClick(linkText: 'Add External Assignment')
    else expect(false, 'Invalid assignment type').to.be.true

goOpen = (test, title) ->
  # wait until the calendar is open
  verify(test)
  # TODO: Make this a `data-title` attribute
  # HACK: Might need to scroll the item to click on into view
  el = test.waitAnd(css: "[data-title='#{title}']")
  test.scrollTo(el)
  el.click()
  test.scrollTop()

goPerformanceForecast = (test) ->
  test.waitClick(linkText: 'Performance Forecast')

Popup =
  verify: (test) ->
    # wait until the calendar is open
    test.waitAnd(css: '.plan-modal .panel.panel-default')
  close: (test) ->
    test.waitClick(css: '.plan-modal .close')
    test.sleep(2000) # Wait for the modal to animate and disappear

  goEdit: (test) ->
    test.waitClick(linkText: 'Edit Assignment')

  goReview: (test) ->
    # BUG: Should rely on button classes
    test.waitClick(linkText: 'Review Metrics')
    # Verify the review page loaded
    test.waitAnd(css: '.task-teacher-review .task-breadcrumbs')


module.exports = {verify, createNew, goOpen, goPerformanceForecast, Popup}
