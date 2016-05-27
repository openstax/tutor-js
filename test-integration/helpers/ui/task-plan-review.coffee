selenium = require 'selenium-webdriver'
_ = require 'underscore'

{TestHelper} = require './test-element'

COMMON_ELEMENTS =
  backToScores:
    linkText: 'Back To Scores'


# all convenience functions for helping with task tests will be seen here.
class TaskPlanReview extends TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?=
      css: '.task-teacher-review'
    super(test, testElementLocator, COMMON_ELEMENTS)


module.exports = TaskPlanReview
