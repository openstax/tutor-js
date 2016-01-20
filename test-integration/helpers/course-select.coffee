selenium = require 'selenium-webdriver'
CourseCalendar = require './calendar'

#   category: 'BIOLOGY', 'PHYSICS', 'ANY'
goTo = (test, category) =>
  # Go to the bio dashboard
  switch category
    when 'BIOLOGY' then test.waitClick(css: '[data-appearance="biology"] > [href*="calendar"]')
    when 'PHYSICS' then test.waitClick(css: '[data-appearance="physics"] > [href*="calendar"]')
    when 'CC'      then test.waitClick(css: '[data-title="Concept Coach"] > [href*="cc-dashboard"]')
    else test.waitClick(css: '[data-appearance] > [href*="calendar"]')

  CourseCalendar.verify(test) unless category is 'CC'

module.exports = {goTo}
