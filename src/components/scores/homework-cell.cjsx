React    = require 'react'
CellStatusMixin = require './cell-status-mixin'
TaskHelper = require '../../helpers/task'

module.exports = React.createClass
  displayName: 'HomeworkCell'
  mixins: [CellStatusMixin] # handles rendering

  render: ->
    message = if @props.task.status is 'not_started'
      'Not started'
    else if TaskHelper.isDue(@props.task)
      "#{@props.task.correct_exercise_count}/#{@props.task.exercise_count}"
    else if @props.task.status is 'completed'
      'Complete'
    else
      'In progress'

    @renderLink({message})
