selenium = require 'selenium-webdriver'
CourseCalendar = require './calendar'

#   category: 'BIOLOGY', 'PHYSICS', 'ANY'
goTo = (test, category) =>
  # Go to the bio dashboard
  switch category
    when 'BIOLOGY' then test.waitClick(css: '[data-category="biology"]')
    when 'PHYSICS' then test.waitClick(css: '[data-category="physics"]')
    else test.waitClick(css: '[data-category]')

  CourseCalendar.verify(test)

module.exports = {goTo}
