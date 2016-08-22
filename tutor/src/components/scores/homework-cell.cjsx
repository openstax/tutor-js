React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
classNames = require 'classnames'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'
PieProgress = require './pie-progress'
{LateWork} = require './late-work'

TH = require '../../helpers/task'

HomeworkCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  show: -> @refs.trigger.show()
  hide: -> @refs.trigger.hide()

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
    completed = task.completed_exercise_count is task.exercise_count
    scoreText = '---'
    if completed or TH.isDue(task)
      if displayAs is 'number'
        scoreText = scoreNumber
      else
        scoreText = scorePercent

    score =
      <div className="score">
        <Router.Link to='viewTaskStep'
          data-assignment-type="#{task.type}"
          params={courseId: courseId, id: task.id, stepIndex: 1}>
            {scoreText}
        </Router.Link>
      </div>

    scoreNotStarted = <div className="score not-started">---</div>

    <div className="scores-cell #{classNames(highlighted: @props.task.showingLateOverlay)}">

      {if notStarted then scoreNotStarted else score }

      <div className="worked">
        <BS.OverlayTrigger
        ref="trigger"
        placement="left"
        delayShow={1000}
        delayHide={0}
        overlay={tooltip}>
          <span className='trigger-wrap'
          onMouseOver={@show}
          onMouseLeave={@hide}>
            <PieProgress
              isConceptCoach={isConceptCoach}
              size={20}
              value={TH.getCompletedPercent(task)}
              isLate={TH.isDue(task)}
            />
          </span>
        </BS.OverlayTrigger>
      </div>

      {<LateWork
        onMouseOver={@show}
        onMouseLeave={@hide}
        task={task}
        columnIndex={columnIndex} /> if TH.isLate(task)}

    </div>



module.exports = HomeworkCell
