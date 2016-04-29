React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'
PieProgress = require './pie-progress'
LateWork = require './late-work'


ReadingCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  showPercent: (numerator) ->
    {task} = @props
    (numerator / task.step_count) * 100

  getProgress: (isAccepted) ->
    {task} = @props
    if isAccepted
      task.completed_step_count
    else
      task.completed_on_time_step_count

  render: ->
    {task, courseId, displayAs, isConceptCoach, rowIndex, columnIndex, period_id} = @props

    isLate = task.completed_on_time_step_count < task.completed_step_count
    isIncludedInAverages = task.is_included_in_averages
    isAccepted = task.is_late_work_accepted

    progress = @getProgress(isAccepted)

    progressPercent = Math.round(@showPercent(progress))


    tooltip =
      <BS.Popover
        id="scores-cell-info-popover-#{task.id}"
        className='scores-scores-tooltip-completed-info'>
        <div className='info'>
          <div className='row'>
            <div>Completed {progressPercent}%</div>
          </div>
        </div>
      </BS.Popover>

    

    lateProps =
      {
        task: task,
        rowIndex: rowIndex,
        columnIndex: columnIndex,
        courseId: courseId,
        period_id: period_id,
        acceptValue: @showPercent(@getProgress(not isAccepted))

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
            value={progressPercent}
            isLate={isLate} />
          </span>
        </BS.OverlayTrigger>
      </div>

      {latework if isLate}
    </div>



module.exports = ReadingCell
