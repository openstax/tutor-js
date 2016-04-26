React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'
PieProgress = require './pie-progress'
LateWork = require './late-work'


ReadingCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  render: ->
    {task, courseId, displayAs, isConceptCoach, rowIndex, columnIndex, period_id} = @props
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
        </div>
      </BS.Popover>

    isLate = task.completed_on_time_step_count < task.completed_step_count

    lateProps =
      {
        task: task,
        rowIndex: rowIndex,
        columnIndex: columnIndex,
        courseId: courseId,
        period_id: period_id

      }
    latework = <LateWork {...lateProps} />


    <div className="scores-cell">

      <div className="worked wide">
        <BS.OverlayTrigger
        placement="left"
        delayShow={1000}
        delayHide={0}
        overlay={tooltip}>
          <span className='trigger-wrap'>
            <PieProgress
            isConceptCoach={isConceptCoach}
            size={24}
            value={pieValue}
            isLate={isLate} />
          </span>
        </BS.OverlayTrigger>
      </div>

      {latework if isLate}
    </div>



module.exports = ReadingCell
