React    = require 'react'
CellStatusMixin = require './cell-status-mixin'

ConceptCoachCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  render: ->
    msg = if @props.task.status is 'in_progress'
      'In progress'
    else
      "#{@props.task.correct_exercise_count}/#{@props.task.exercise_count}"

    <div>{msg}</div>

module.exports = ConceptCoachCell
