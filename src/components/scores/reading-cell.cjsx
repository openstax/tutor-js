React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'
PieProgress = require './pie-progress'
{LateWork} = require './late-work'
{ScoresStore} = require '../../flux/scores'

ReadingCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  render: ->
    {task, courseId, displayAs, isConceptCoach, rowIndex, columnIndex, period_id} = @props

    tooltip =
      <BS.Popover
        id="scores-cell-info-popover-#{task.id}"
        className='scores-scores-tooltip-completed-info'>
        <div className='info'>
          <div className='row'>
            <div>Completed {ScoresStore.getHumanCompletedPercent(task)}</div>
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
            <PieProgress
              isConceptCoach={isConceptCoach}
              size={24}
              value={ScoresStore.getCompletedPercent(task)}
              isLate={ScoresStore.isTaskLate(task)}
            />
          </span>
        </BS.OverlayTrigger>
      </div>

      {<LateWork task={task} /> if ScoresStore.isTaskLate(task)}

    </div>



module.exports = ReadingCell
