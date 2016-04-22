React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'
PieProgress = require './pie-progress'


ReadingCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  render: ->
    {task, courseId} = @props
    scorePercent =
      Math.round((task.correct_exercise_count / task.exercise_count) * 100)
    pieValue =
      Math.round((task.completed_exercise_count / task.exercise_count) * 100)
    tooltip =
      <BS.Popover
        id="cc-cell-info-popover-#{task.id}"
        className='cc-scores-tooltip-completed-info'>
        <div className='info'>
          <div className='row'>
            <div>Completed {pieValue}%</div>
          </div>
          <div className='row'>
            <div>
              {task.completed_exercise_count} of 
               {task.exercise_count} questions
            </div>
          </div>
          <div className='row'>
            <div>
              <span>Last Worked:</span> <Time
                    format='M/M' 
                    date={task.last_worked_at} />
            </div>
          </div>
        </div>
      </BS.Popover>


    <div className="cc-cell">

      <div className="worked wide">
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



module.exports = ReadingCell
