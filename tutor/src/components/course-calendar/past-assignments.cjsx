React = require 'react'
BS    = require 'react-bootstrap'
classnames = require 'classnames'

{CloneAssignmentLink} = require './task-dnd'

isEmpty = require 'lodash/isEmpty'
partial = require 'lodash/partial'

{PastTaskPlansActions, PastTaskPlansStore} = require '../../flux/past-task-plans'
LoadableItem = require '../loadable-item'


PastAssignmentsLoading = ->
  <div className='past-assignments'>
    <div className="no-plans is-loading">
      Loading past assignments...
    </div>
  </div>

PastAssignments = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired

  render: ->
    plans = PastTaskPlansStore.get(@props.courseId) or []
    return null if isEmpty(plans)
    <div className={classnames('past-assignments', @props.className)}>
      <div className="section-label">COPIED</div>
      <div className="plans">
        {for plan in plans
          <CloneAssignmentLink key={plan.id} plan={plan} />}
        {for plan in plans
          <CloneAssignmentLink key={"#{plan.id}-2"} plan={plan} />}
        {for plan in plans
          <CloneAssignmentLink key={"#{plan.id}-3"} plan={plan} />}
      </div>
    </div>

PastAssignmentsShell = React.createClass
  render: ->
    {courseId, className} = @props
    <LoadableItem
      id={courseId}
      store={PastTaskPlansStore}
      actions={PastTaskPlansActions}
      renderItem={ -> <PastAssignments courseId={courseId} className={className}/> }
      renderLoading={ PastAssignmentsLoading }
    />

module.exports = PastAssignmentsShell
