React = require 'react'

TimeHelper = require '../../helpers/time'
Icon = require '../icon'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TaskingActions} = require '../../flux/tasking'
{ default: TeacherTaskPlans } = require '../../models/teacher-task-plans'

PlanClonePlaceholder = React.createClass

  propTypes:
    planType: React.PropTypes.string.isRequired
    planId:   React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    due_at:   TimeHelper.PropTypes.moment
    onLoad:   React.PropTypes.func.isRequired
    position: React.PropTypes.shape(
      x: React.PropTypes.number
      y: React.PropTypes.number
    ).isRequired

  componentWillMount: ->
    if TaskPlanStore.isLoaded(@props.planId)
      @onLoad()
    else
      TaskPlanStore.on("loaded.#{@props.planId}", @onLoad)

  onLoad: ->
    taskPlanId = TaskPlanStore.freshLocalId()
    TaskPlanActions.createClonedPlan(taskPlanId, {
      planId: @props.planId,
      courseId: @props.courseId,
      due_at: TimeHelper.toISO(@props.due_at)
    })
    TeacherTaskPlans.forCourseId(@props.courseId).addClone(TaskPlanStore.get(planId))
    @props.onLoad(taskPlanId)

  render: ->
    <div className="plan-clone-placeholder"
      data-assignment-type={@props.planType}
      style={left: @props.position.x, top: @props.position.y}
    >
      <label>
        <Icon type='spinner' spin /> Adding…
      </label>
    </div>



module.exports = PlanClonePlaceholder
