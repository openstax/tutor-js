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

    scorePercent =
      Math.round((task.correct_exercise_count / task.exercise_count) * 100)
    pieValue =
      Math.round((task.completed_exercise_count / task.exercise_count) * 100)
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
                "#{task.correct_exercise_count} of #{task.exercise_count}"
              else
                "#{scorePercent}%"
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
            value={pieValue} />
          </span>
        </BS.OverlayTrigger>
      </div>

      {latework}
    </div>



module.exports = HomeworkCell
