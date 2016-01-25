selenium = require 'selenium-webdriver'
{TestHelper} = require './test-element'

class CourseSelect extends TestHelper

  constructor: (test ) ->
    super(test, '.course-listing')

  goTo: (category) ->
    @waitUntilLoaded()
    # Go to the bio dashboard
    switch category
      when 'BIOLOGY' then @test.waitClick(css: '[data-appearance="biology"] > [href*="calendar"]')
      when 'PHYSICS' then @test.waitClick(css: '[data-appearance="physics"] > [href*="calendar"]')
      else @test.waitClick(css: '[data-appearance] > [href*="calendar"]')

module.exports = CourseSelect
