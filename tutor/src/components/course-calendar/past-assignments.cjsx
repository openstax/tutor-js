React = require 'react'
BS    = require 'react-bootstrap'
classnames = require 'classnames'

{CloneAssignmentLink} = require './task-dnd'

isEmpty = require 'lodash/isEmpty'
partial = require 'lodash/partial'

{PastTaskPlansActions, PastTaskPlansStore} = require '../../flux/past-task-plans'
LoadableItem = require '../loadable-item'


PastAssignmentsLoading = ({className}) ->
  <div className={classnames('past-assignments', className)}>
    <div className="no-plans is-loading">
      Loading past assignments...
    </div>
  </div>

PastAssignments = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    cloningPlanId: React.PropTypes.string

  render: ->
    plans = PastTaskPlansStore.get(@props.courseId) or []
    return null if isEmpty(plans)

    <div className={classnames('past-assignments', @props.className)}>
      <div className="section-label">Copied</div>
      <div className="plans">
        {for plan in plans
          <CloneAssignmentLink
            key={plan.id}
            plan={plan}
            isEditing={plan.id is @props.cloningPlanId}
          />}
      </div>
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

module.exports = PastAssignmentsShell
