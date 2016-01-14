selenium = require 'selenium-webdriver'
CourseCalendar = require './calendar'

#   category: 'BIOLOGY', 'PHYSICS', 'ANY'
goTo = (test, category) =>
  # Go to the bio dashboard
  switch category
    when 'BIOLOGY' then test.waitClick(css: '[data-appearance="biology"] > [href*="calendar"]')
    when 'PHYSICS' then test.waitClick(css: '[data-appearance="physics"] > [href*="calendar"]')
    else test.waitClick(css: '[data-appearance] > [href*="calendar"]')

  CourseCalendar.verify(test)

module.exports = {goTo}
