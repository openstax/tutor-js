selenium = require 'selenium-webdriver'
{TaskHelper} = require './task'

class CourseSelect extends TaskHelper

  goTo: (category) ->
    # Go to the bio dashboard
    switch category
      when 'BIOLOGY' then @test.waitClick(css: '[data-appearance="biology"] > [href*="calendar"]')
      when 'PHYSICS' then @test.waitClick(css: '[data-appearance="physics"] > [href*="calendar"]')
      else @test.waitClick(css: '[data-appearance] > [href*="calendar"]')

module.exports = CourseSelect
