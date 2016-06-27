React = require 'react'
BS = require 'react-bootstrap'
Markdown = require '../markdown'
BindStoreMixin = require '../bind-store-mixin'
TaskPlanHelper = require '../../helpers/task-plan'
Clipboard = require '../../helpers/clipboard'
LoadableItem = require '../loadable-item'

moment = require 'moment'
Icon = require '../icon'
{TaskPlanStatsStore, TaskPlanStatsActions} = require '../../flux/task-plan-stats'

{TeacherTaskPlanStore} = require '../../flux/teacher-task-plan'
{CourseStore} = require '../../flux/course'

DUE_FORMAT = 'M/D/YYYY [at] h:mma'

LmsInfo = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    plan: React.PropTypes.shape(
      id: React.PropTypes.string.isRequired
      title: React.PropTypes.string.isRequired
      shareable_url: React.PropTypes.string
    ).isRequired

  mixins: [BindStoreMixin]
  bindStore: TeacherTaskPlanStore

  focusInput: (ev) ->
    ev.currentTarget.querySelector('input').select()
    Clipboard.copy()

  closePopOver: ->
    @refs.overlay.hide()

  renderDueDates: ->
    taskPlan = TeacherTaskPlanStore.getPlanId(@props.courseId, @props.plan.id)
    taskPlanDates = TaskPlanHelper.dates( taskPlan, only: 'due_at' )
    if taskPlanDates.all?
      <p>Due: {moment(taskPlanDates.all.due_at).format(DUE_FORMAT)}</p>
    else
      course = CourseStore.get(@props.courseId)
      <div>
        <p>Due:</p>
        <ul>
          {for periodId, dates of taskPlanDates
            period = _.findWhere(course.periods, id: periodId)
            <li key={periodId}>{period.name}: {moment(dates.due_at).format(DUE_FORMAT)}</li>}
        </ul>
      </div>


  renderPopOver: ->
    {title, description} = @props.plan
    shareable_url = @getStats().shareable_url
    l = window.location
    url = "#{l.protocol}//#{l.host}#{shareable_url}"

    <BS.Popover
      className="lms-sharable-link"
      title={
        <div>
          Copy information for your LMS
          <Icon type='close' onClick={@closePopOver} className="close" />
        </div>
      }
      id={_.uniqueId('sharable-link-popover')}
    >
      <div className='body' onClick={@focusInput}>
        <input ref='input' value={url} readOnly={true} />
        -
        <p>Summary</p>
        <a href={url}>{title}</a>
        {@renderDueDates()}
        {<p>
          Description: <Markdown className="description" text={description} block={true}/>
        </p> if description}
      </div>
    </BS.Popover>

  getStats: ->
    TaskPlanStatsStore.get(this.props.plan.id) or {}

  renderLink: ->
    return null unless @getStats().shareable_url
    <div className="lms-info">
      <BS.OverlayTrigger trigger="click"
        placement="top"
        ref="overlay"
        container={@}
        overlay={@renderPopOver()}
      >
        <a onClick={@togglePopover} className="get-link">Get assignment link</a>
      </BS.OverlayTrigger>

    </div>


  render: ->
  #  return null unless @props.plan.shareable_url
    <LoadableItem
      id={@props.plan.id}
      store={TaskPlanStatsStore}
      actions={TaskPlanStatsActions}
      renderItem={@renderLink}
    />




module.exports = LmsInfo
