React    = require 'react'
CellStatusMixin = require './cell-status-mixin'
TaskHelper = require '../../helpers/task'

module.exports = React.createClass
  displayName: 'HomeworkCell'
  mixins: [CellStatusMixin] # handles rendering

  render: ->
    status = TaskHelper.getLateness(@props.task)

    message = if status.is_late
      'Incomplete'
    else
      "#{@props.task.correct_exercise_count}/#{@props.task.exercise_count}"

    @renderLink({message})
