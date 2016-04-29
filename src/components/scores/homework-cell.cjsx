React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'
PieProgress = require './pie-progress'
LateWork = require './late-work'


HomeworkCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  getScore: (isAccepted) ->
    {task} = @props
    if isAccepted
      task.correct_exercise_count
    else
      task.correct_on_time_exercise_count

  getProgress: (isAccepted) ->
    {task} = @props
    if isAccepted
      task.completed_exercise_count
    else
      task.completed_on_time_exercise_count

  showPercent: (numerator) ->
    {task} = @props
    (numerator / task.exercise_count) * 100

  showNumber: (numerator) ->
    {task} = @props
    "#{numerator} of #{task.exercise_count}"

  render: ->
    {task, courseId, displayAs, isConceptCoach, rowIndex, columnIndex, period_id} = @props

    isLate = task.completed_on_time_exercise_count < task.completed_exercise_count
    isIncludedInAverages = task.is_included_in_averages
    isAccepted = task.is_late_work_accepted

    score = @getScore(isAccepted)
    progress = @getProgress(isAccepted)

    scorePercent = @showPercent(score)
    scoreNumber = @showNumber(score)

    progressPercent = Math.round(@showPercent(progress))
    progressNumber = @showNumber(progress)


    tooltip =
      <BS.Popover
        id="scores-cell-info-popover-#{task.id}"
        className='scores-scores-tooltip-completed-info'>
        <div className='info'>
          <div className='row'>
            <div>Completed {progressPercent}%</div>
          </div>
          <div className='row'>
            <div>
              {progressNumber} questions
            </div>
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
        currentValue: @showPercent(@getScore(isAccepted)),
        acceptValue: @showPercent(@getScore(not isAccepted)),
        isIncludedInAverages: isIncludedInAverages

      }
    latework = <LateWork {...lateProps} />


    <div className="scores-cell">
      <div className="score">
        <Router.Link to='viewTaskStep'
          data-assignment-type="#{task.type}"
          params={courseId: courseId, id: task.id, stepIndex: 1}>
            {
              if displayAs is 'number'
                scoreNumber
              else
                "#{(scorePercent).toFixed(0)}%"
            }       
        </Router.Link>
        
      </div>

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
            value={progressPercent}
            isLate={isLate} />
          </span>
        </BS.OverlayTrigger>
      </div>

      {latework if isLate}
    </div>



module.exports = HomeworkCell
