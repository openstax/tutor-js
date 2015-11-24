React  = require 'react'
moment = require 'moment'

CellStatusMixin = require './cell-status-mixin'

ConceptCoachCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  lastWorked: ->
    moment(@props.task.last_worked_at).format('MMM. D')

  render: ->
    <div className="cc-cell">
      <div className="score">{@props.task.correct_exercise_count} of {@props.task.exercise_count}</div>
      <div className="worked">{@lastWorked()}</div>
    </div>



module.exports = ConceptCoachCell
