React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'
PieProgress = require './pie-progress'

ConceptCoachCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  render: ->
    pieValue =
      Math.round((@props.task.correct_exercise_count / @props.task.exercise_count) * 100)
    tooltip =
      <BS.Tooltip>
        <div>
          Date Last Worked: <Time format='MMM. D' date={@props.task.last_worked_at} />
        </div>
      </BS.Tooltip>

    <div className="cc-cell">
      <Router.Link className="score" to='viewTaskStep'
        data-assignment-type="#{@props.task.type}"
        params={courseId: @props.courseId, id: @props.task.id, stepIndex: 1}>
          {
            if @props.displayAs is 'number'
              "#{@props.task.correct_exercise_count} of #{@props.task.exercise_count}"
            else
              "#{pieValue}%"
          }
      </Router.Link>
      <BS.OverlayTrigger
        placement='top'
        delayShow={1000}
        delayHide={0}
        overlay={tooltip}>
        <div className="worked">
          <PieProgress size={24} value={pieValue} roundToQuarters />
        </div>
      </BS.OverlayTrigger>
    </div>



module.exports = ConceptCoachCell
