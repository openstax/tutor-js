React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'
PieProgress = require './pie-progress'

ConceptCoachCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  render: ->
    scorePercent =
      Math.round((@props.task.correct_exercise_count / @props.task.exercise_count) * 100)
    pieValue =
      Math.round((@props.task.completed_exercise_count / @props.task.exercise_count) * 100)
    tooltip =
      <BS.Popover
        id="cc-cell-info-popover-#{@props.task.id}"
        className='cc-scores-tooltip-completed-info'>
        <div className='info'>
          <div className='row'>
            <div>Completed {pieValue}%</div>
          </div>
          <div className='row'>
            <div>
              {@props.task.completed_exercise_count} of 
               {@props.task.exercise_count} questions
            </div>
          </div>
          <div className='row'>
            <div>
              <span>Last Worked:</span> <Time
                    format='M/M' 
                    date={@props.task.last_worked_at} />
            </div>
          </div>
        </div>
      </BS.Popover>


    <div className="cc-cell">
      <Router.Link className="score" to='viewTaskStep'
        data-assignment-type="#{@props.task.type}"
        params={courseId: @props.courseId, id: @props.task.id, stepIndex: 1}>
          {
            if @props.displayAs is 'number'
              "#{@props.task.correct_exercise_count} of #{@props.task.exercise_count}"
            else
              "#{scorePercent}%"
          }
      </Router.Link>

      <div className="worked">
        <BS.OverlayTrigger
        placement="left"
        delayShow={1000}
        delayHide={0}
        overlay={tooltip}>
          <span className='trigger-wrap'>
            <PieProgress size={24} value={pieValue} roundToQuarters />
          </span>
        </BS.OverlayTrigger>
      </div>
    </div>



module.exports = ConceptCoachCell
