selenium = require 'selenium-webdriver'
{TestHelper} = require './test-element'
_ = require 'underscore'


COMMON_ELEMENTS =
  courseByAppearance: ({appearance, isCoach}, roles = ['student', 'teacher']) ->

    roles = [roles.toLowerCase()] if _.isString(roles)

    dataAttr = 'data-appearance'

    if appearance?
      dataAttr += "='#{appearance}'"

    selectors = {}

    if isCoach
      selectors.teacher = "[#{dataAttr}] > [href*='cc-dashboard']"
      selectors.student = "[#{dataAttr}] > [href*='content']"
    else
      selectors.teacher = "[#{dataAttr}] > [href*='calendar']"
      selectors.student = "[#{dataAttr}] > [href*='list']"

    validLinks = _.chain(selectors).pick(roles).values().value()

    css: validLinks.join(', ')

  courseByTitle: (title) ->
    css: "[data-title='#{name}'] > a"


###
Exposes helper functions for testing `.course-listing`
###
class CourseSelect extends TestHelper

  constructor: (test, testElementLocator) ->

    testElementLocator ?=
      css: '.course-listing'
    super(test, testElementLocator, COMMON_ELEMENTS)

  getByType: (category, roles) ->
    @waitUntilLoaded()

    switch category
      when 'BIOLOGY'
        course = @el.courseByAppearance({appearance: 'college_biology'}, roles).findElement()
      when 'PHYSICS'
        course = @el.courseByAppearance({appearance: 'hs_physics'}, roles).findElement()
      when 'CONCEPT_COACH'
        course = @el.courseByAppearance({isCoach: true}, roles).findElement()
      else
        course = @el.courseByAppearance({}, roles).findElement()

    course

  canGoToType: (category, roles) ->
    @getByType(category, roles).then ->
        true
      .thenCatch (error) =>
        console.log("Course matching #{category}, #{roles} not found.")
        @test.utils.verbose("Course matching #{category}, #{roles} not found.  #{error.message}")
        false

  goToByType: (category, roles) ->
    course = @getByType(category, roles)
    course.click()


  goToByTitle: (name) ->
    @el.courseByTitle(name).waitClick()

module.exports = CourseSelect
