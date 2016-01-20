selenium = require 'selenium-webdriver'
CourseCalendar = require './calendar'
CCDashboard = require './cc-dashboard'

#   category: 'BIOLOGY', 'PHYSICS', 'ANY'
goTo = (test, category) =>
  # Go to the bio dashboard
  switch category
    when 'BIOLOGY' then test.waitClick(css: '[data-appearance="biology"] > [href*="calendar"]')
    when 'PHYSICS' then test.waitClick(css: '[data-appearance="physics"] > [href*="calendar"]')
    when 'CONCEPT_COACH' then test.waitClick(css: '[data-appearance] > [href*="cc-dashboard"]')
    else test.waitClick(css: '[data-appearance] > [href*="calendar"]')

  if category is 'CONCEPT_COACH'
    CCDashboard.verify(test)
  else
    CourseCalendar.verify(test)


module.exports = {goTo}
