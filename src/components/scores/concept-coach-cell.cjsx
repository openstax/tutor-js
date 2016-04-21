React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'
PieProgress = require './pie-progress'
LateWork = require './late-work'

{ScoresStore, ScoresActions} = require '../../flux/scores'

ConceptCoachCell = React.createClass

  mixins: [CellStatusMixin] # prop validation

  recalcAverages: ->
    ScoresStore.recalcAverages(@props.courseId, @props.period_id)

  render: ->
    {task, courseId, displayAs, isConceptCoach} = @props
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

    lateProps =
      {
        task: @props.task,
        recalcAverages: @recalcAverages,
        rowIndex: @props.rowIndex,
        columnIndex: @props.columnIndex

      }
    latework = <LateWork {...lateProps} />


    <div className="cc-cell">
      <Router.Link className="score" to='viewTaskStep'
        data-assignment-type="#{task.type}"
        params={courseId: courseId, id: task.id, stepIndex: 1}>
          {
            if displayAs is 'number'
              "#{task.correct_exercise_count} of #{task.exercise_count}"
            else
              "#{scorePercent}%"
          }
      </Router.Link>

      <div className="worked">
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

      {if not isConceptCoach and task.type is 'homework' then latework}
    </div>



module.exports = ConceptCoachCell
