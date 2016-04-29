React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
Time   = require '../time'

{ScoresStore, ScoresActions} = require '../../flux/scores'

LateWork = React.createClass
  displayName: 'LateWork'

  setLateStatus: ->
    {task, courseId, period_id, columnIndex, isIncludedInAverages} = @props
    if not @isUpdatingLateStatus()
      if task.is_late_work_accepted
        ScoresActions.rejectLate(task.id, courseId)
      else
        ScoresActions.acceptLate(task.id, courseId)

      if isIncludedInAverages
        updateAveragesParams = [
          task,
          courseId,
          period_id,
          columnIndex
        ]
        ScoresActions.updateAverages(updateAveragesParams...)

    @refs.overlay.hide()


  isUpdatingLateStatus: ->
    ScoresStore.isUpdatingLateStatus(@props.task.id)

  render: ->
    {task, acceptValue} = @props
    lateQuestionCount =
      task.completed_exercise_count - task.completed_on_time_exercise_count
    titleProgress =
      if task.type is 'homework'
        if not task.is_late_work_accepted
          "#{lateQuestionCount} questions worked after the due date" 
        else 
          'You accepted this student\'s late score.'
      else
        if not task.is_late_work_accepted
          'Reading progress after the due date' 
        else 
          'You accepted this student\'s late reading progress.'
    title =
      if @isUpdatingLateStatus()
        <span>
          <i className='fa fa-spinner fa-spin'/> Updating...
        </span>
      else
        <span>{titleProgress}</span>
    buttonLabel =
      if task.type is 'homework'
        if not task.is_late_work_accepted
          'Accept late score' 
        else 
          'Use this score'
      else
        if not task.is_late_work_accepted
          'Accept late progress' 
        else 
          'Use due date progress'
    acceptedClass = if task.is_late_work_accepted then 'accepted' else ''
    keyword = if task.type is 'homework' then 'Score' else 'Progress'
    time =
      if task.is_late_work_accepted
        'due date'
      else
        <Time date={task.last_worked_at} format='shortest'/>
    popover =
      <BS.Popover
        title={title}
        id="late-work-info-popover-#{task.id}"
        className="late-work-info-popover #{acceptedClass}">
          <div className='late-status'>
            <div className='description'>
              <span className='title'>
                {"#{keyword} on "}
                {time}:
              </span>
              <span className='status'>{"#{Math.round(acceptValue)}%"}</span>
            </div>
            <BS.Button className='late-button' onClick={@setLateStatus}>
              {buttonLabel}
            </BS.Button>
          </div>

      </BS.Popover>



    <div className="late-caret-trigger">
      <BS.OverlayTrigger
      ref="overlay"
      placement="top"
      trigger="click"
      rootClose={true}
      overlay={popover}>
        <div className="late-caret #{acceptedClass}"></div>
      </BS.OverlayTrigger>
    </div>


module.exports = LateWork
