React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

{ScoresStore, ScoresActions} = require '../../flux/scores'

LateWork = React.createClass
  displayName: 'LateWork'

  setLateStatus: ->
    {task} = @props
    if not @isAccepting() and not @isRejecting()
      if task.is_late_work_accepted
        ScoresActions.rejectLate(task.id)
      else
        ScoresActions.acceptLate(task.id)
    #ScoresStore.recalcAverages(@props.courseId, @props.period_id)

  isAccepting: ->
    ScoresStore.isAccepting(@props.task.id)

  isRejecting: ->
    ScoresStore.isRejecting(@props.task.id)

  render: ->
    {task, rowIndex, columnIndex} = @props
    title =
      if @isAccepting() or @isRejecting()
        <span>
          <i className='fa fa-spinner fa-spin'/> Updating...
        </span>
      else
        <span>late work</span>
    popover =
      <BS.Popover
        title={title}
        id="late-work-info-popover-#{task.id}"
        className='late-work-info-popover'>
          <BS.Button onClick={@setLateStatus}>
            late work
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
