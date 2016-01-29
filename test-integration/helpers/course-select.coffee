selenium = require 'selenium-webdriver'
{TestHelper} = require './test-element'


COMMON_ELEMENTS =
  courseLink: (appearance, isCoach = false) ->
    dataAttr = 'data-appearance'

    if appearance?
      dataAttr += "='#{appearance}'"

    if isCoach
      teacherLink = "[#{dataAttr}] > [href*='cc-dashboard']"
      studentLink = "[#{dataAttr}] > [href*='content']"
    else
      teacherLink = "[#{dataAttr}] > [href*='calendar']"
      studentLink = "[#{dataAttr}] > [href*='list']"

    css: "#{teacherLink}, #{studentLink}"


class CourseSelect extends TestHelper

  constructor: (test, testElementLocator) ->

    testElementLocator ?= '.course-listing'
    super(test, '.course-listing', COMMON_ELEMENTS)

  goTo: (category) ->
    @waitUntilLoaded()
    # Go to the bio dashboard
    switch category
      when 'BIOLOGY' then @el.courseLink.get('biology').click()
      when 'PHYSICS' then @el.courseLink.get('physics').click()
      else @el.courseLink.get().click()

module.exports = CourseSelect
