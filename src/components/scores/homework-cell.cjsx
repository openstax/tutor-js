React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'
PieProgress = require './pie-progress'
{LateWork} = require './late-work'

TH = require '../../helpers/task'

HomeworkCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  render: ->
    {task, courseId, displayAs, isConceptCoach, rowIndex, columnIndex, period_id} = @props

    tooltip =
      <BS.Popover
        id="scores-cell-info-popover-#{task.id}"
        className='scores-scores-tooltip-completed-info'>
        <div className='info'>
          <div className='row'>
            <div>Completed {TH.getHumanCompletedPercent(task)}</div>
          </div>
          <div className='row'>
            <div>
              {TH.getHumanProgress(task)} questions
            </div>
          </div>
        </div>
      </BS.Popover>

    notStarted = task.completed_exercise_count <= 0

    scorePercent = TH.getHumanScorePercent(task)
    scoreNumber = TH.getHumanScoreNumber(task)

    score =
      <div className="score">
        <Router.Link to='viewTaskStep'
          data-assignment-type="#{task.type}"
          params={courseId: courseId, id: task.id, stepIndex: 1}>
            {if displayAs is 'number' then scoreNumber else scorePercent}
        </Router.Link>
      </div>

    scoreNotStarted = <div className="score not-started">---</div>

    <div className="scores-cell">

      {if notStarted then scoreNotStarted else score }

      <div className="worked">
        <BS.OverlayTrigger
        placement="left"
        delayShow={1000}
        delayHide={0}
        overlay={tooltip}>
          <span className='trigger-wrap'>
            <PieProgress
              isConceptCoach={isConceptCoach}
              size={24}
              value={TH.getCompletedPercent(task)}
              isLate={TH.isLate(task)}
            />
          </span>
        </BS.OverlayTrigger>
      </div>

      {<LateWork task={task} columnIndex={columnIndex} /> if TH.isLate(task)}

    </div>



module.exports = HomeworkCell
