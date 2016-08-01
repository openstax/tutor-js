Task = require './task'
_ = require 'underscore'

TASK_TEACHER_COMMON_ELEMENTS =
  backToScores:
    linkText: 'Back To Scores'

class TaskTeacher extends Task

  constructor: (test, testElementLocator) ->
    super(test, testElementLocator)

    _.each TASK_TEACHER_COMMON_ELEMENTS, @setCommonElement


module.exports = TaskTeacher
