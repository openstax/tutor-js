selenium = require 'selenium-webdriver'
{TestHelper} = require './test-element'
utils = require './utils'

class CourseSelect extends TestHelper

  constructor: (test ) ->
    super(test, '.course-listing')

  goTo: (category) ->
    @waitUntilLoaded()
    # Go to the bio dashboard
    switch category
      when 'BIOLOGY' then wait(@test).click(css: '[data-appearance="biology"] > [href*="calendar"]')
      when 'PHYSICS' then wait(@test).click(css: '[data-appearance="physics"] > [href*="calendar"]')
      else wait(@test).click(css: '[data-appearance] > [href*="calendar"]')

module.exports = CourseSelect
