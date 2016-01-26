React  = require 'react'
Router = require 'react-router'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'
PieProgress = require './pie-progress'

ConceptCoachCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  render: ->
    pieValue = (@props.task.correct_exercise_count / @props.task.exercise_count) * 100
    <div className="cc-cell">
      <Router.Link className="score" to='viewTaskStep'
        data-assignment-type="#{@props.task.type}"
        params={courseId: @props.courseId, id: @props.task.id, stepIndex: 1}
      >
        {@props.task.correct_exercise_count} of {@props.task.exercise_count}
      </Router.Link>
      <div className="worked">
        <PieProgress size={25} value={Math.round(pieValue)} />
      </div>
    </div>



module.exports = ConceptCoachCell
