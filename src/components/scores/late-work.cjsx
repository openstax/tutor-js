React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

{ScoresStore, ScoresActions} = require '../../flux/scores'

LateWork = React.createClass
  displayName: 'LateWork'

  setLateStatus: ->
    {task} = @props
    console.log task
    console.log @isUpdatingLateStatus()
    if not @isUpdatingLateStatus()
      if task.is_late_work_accepted
        ScoresActions.rejectLate(task.id)
      else
        ScoresActions.acceptLate(task.id)
    #ScoresStore.recalcAverages(@props.courseId, @props.period_id)

  updateAverages: ->
    {task, columnIndex, rowIndex} = @props
    #ScoresStore.recalcAverages(@props.courseId, @props.period_id)

  isUpdatingLateStatus: ->
    ScoresStore.isUpdatingLateStatus(@props.task.id)

  render: ->
    {task, rowIndex, columnIndex} = @props
    title =
      if @isUpdatingLateStatus()
        <span>
          <i className='fa fa-spinner fa-spin'/> Updating...
        </span>
      else
        <span>late work</span>
    buttonLabel =
      if task.type is 'homework'
        if task.is_late_work_accepted
          'Accept late score' 
        else 
          'Use this score'
      else
        if task.is_late_work_accepted
          'Accept late progress' 
        else 
          'Use due date progress'
    popover =
      <BS.Popover
        title={title}
        id="late-work-info-popover-#{task.id}"
        className='late-work-info-popover'>
          <BS.Button onClick={@setLateStatus}>
            {buttonLabel}
          </BS.Button>

      </BS.Popover>



    <div className="late-caret-trigger">
      <BS.OverlayTrigger
      placement="top"
      trigger="click"
      rootClose={true}
      overlay={popover}>
        <div className="late-caret"></div>
      </BS.OverlayTrigger>
    </div>


module.exports = LateWork
