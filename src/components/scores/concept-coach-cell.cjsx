React  = require 'react'
moment = require 'moment'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'

ConceptCoachCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  render: ->
    <div className="cc-cell">
      <div className="score">{@props.task.correct_exercise_count} of {@props.task.exercise_count}</div>
      <div className="worked">
        <Time format='MMM. D' date={@props.task.last_worked_at} />
      </div>
    </div>



module.exports = ConceptCoachCell
