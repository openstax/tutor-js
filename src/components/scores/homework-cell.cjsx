React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'
PieProgress = require './pie-progress'
LateWork = require './late-work'


HomeworkCell = React.createClass

  mixins: [CellStatusMixin] # prop validation


  render: ->
    {task, courseId, displayAs, isConceptCoach, rowIndex, columnIndex, period_id} = @props

    isLate = task.completed_on_time_exercise_count < task.completed_exercise_count
    isIncludedInAverages = task.is_included_in_averages

    scorePercent =
      if isLate
        if task.is_late_work_accepted
          task.correct_on_time_exercise_count / task.exercise_count
        else
          task.correct_exercise_count / task.exercise_count
      else
        task.correct_exercise_count / task.exercise_count

    scoreNumber =
      if isLate
        if task.is_late_work_accepted
          "#{task.correct_on_time_exercise_count} of #{task.exercise_count}"
        else
          "#{task.correct_exercise_count} of #{task.exercise_count}"
      else
        "#{task.correct_exercise_count} of #{task.exercise_count}"

    completedNumber =
      if isLate
        if task.is_late_work_accepted
          "#{task.completed_on_time_exercise_count} of #{task.exercise_count}"
        else
          "#{task.completed_exercise_count} of #{task.exercise_count}"
      else
        "#{task.completed_exercise_count} of #{task.exercise_count}"


    pieValue =
      if isLate
        if task.is_late_work_accepted
          task.completed_on_time_exercise_count / task.exercise_count
        else
          task.completed_exercise_count / task.exercise_count
      else
        task.completed_exercise_count / task.exercise_count

    pieValue = Math.round(pieValue) * 100


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
              {completedNumber} questions
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
        period_id: period_id

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
                "#{(scorePercent * 100).toFixed(0)}%"
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
            value={pieValue}
            isLate={isLate} />
          </span>
        </BS.OverlayTrigger>
      </div>

      {latework if isLate}
    </div>



module.exports = HomeworkCell
