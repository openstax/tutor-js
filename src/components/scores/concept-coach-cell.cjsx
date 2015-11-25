React  = require 'react'
Router = require 'react-router'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'

ConceptCoachCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  render: ->
    <div className="cc-cell">
      <div className="score">
        <Router.Link className="score" to='viewTaskStep'
          data-assignment-type="#{@props.task.type}"
          params={courseId: @props.courseId, id: @props.task.id, stepIndex: 1}
        >
          {@props.task.correct_exercise_count} of {@props.task.exercise_count}
        </Router.Link>
      </div>
      <div className="worked">
        <Time format='MMM. D' date={@props.task.last_worked_at} />
      </div>
    </div>



module.exports = ConceptCoachCell
