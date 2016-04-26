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
    pieValue =
      Math.round((task.completed_step_count / task.step_count) * 100)
    tooltip =
      <BS.Popover
        id="scores-cell-info-popover-#{task.id}"
        className='scores-scores-tooltip-completed-info'>
        <div className='info'>
          <div className='row'>
            <div>Completed {pieValue}%</div>
          </div>
          <div className='row'>
            <div>
              {task.completed_step_count} of 
               {task.step_count} questions
            </div>
          </div>
        </div>
      </BS.Popover>


    <div className="scores-cell">

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
