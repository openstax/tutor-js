React = require 'react'
BS    = require 'react-bootstrap'
classnames = require 'classnames'

{CloneAssignmentLink} = require './task-dnd'

{default: TaskPlanHelper} = require '../../helpers/task-plan'
TimeHelper = require '../../helpers/time'
isEmpty = require 'lodash/isEmpty'
partial = require 'lodash/partial'

{PastTaskPlansActions, PastTaskPlansStore} = require '../../flux/past-task-plans'
LoadableItem = require '../loadable-item'


PastAssignmentsLoading = ({className}) ->
  <div className={classnames('past-assignments', className)}>
    <div className="no-plans is-loading">
      Loading copied assignments...
    </div>
  </div>

PastAssignments = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    cloningPlanId: React.PropTypes.string

  getInitialState: ->
    tooltipTarget: null

  offTaskHover: ->
    @setState(tooltipTarget: null, hoveredPlan: null)

  onTaskHover: (plan, ev) ->
    @setState(tooltipTarget: ev.currentTarget, hoveredPlan: plan)

  render: ->
    plans = PastTaskPlansStore.byDueDate(@props.courseId)
    return null if isEmpty(plans)

    <div className={classnames('past-assignments', @props.className)}>
      <div className="section-label">Copied</div>

      <div className="plans">
        {for plan in plans
          <CloneAssignmentLink
            onHover={partial(@onTaskHover, plan)}
            offHover={@offTaskHover}
            key={plan.id}
            plan={plan}
            isEditing={plan.id is @props.cloningPlanId}
          />}
      </div>
      <BS.Overlay
        show={!!@state.tooltipTarget}
        target={@state.tooltipTarget}
        placement="right"
      >
        <BS.Popover id="task-original-due-date">
          Orig. due date {TimeHelper.toHumanDate(TaskPlanHelper.earliestDueDate(@state.hoveredPlan))}
        </BS.Popover>
      </BS.Overlay>

    </div>

PastAssignmentsShell = React.createClass
  render: ->
    {courseId, className} = @props
    <LoadableItem
      id={courseId}
      store={PastTaskPlansStore}
      actions={PastTaskPlansActions}
      renderItem={ => <PastAssignments {...@props}/> }
      renderLoading={ -> <PastAssignmentsLoading className={className}/> }
    />

module.exports = {PastAssignmentsShell, PastAssignments}
