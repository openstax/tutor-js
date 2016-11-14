React = require 'react'
BS    = require 'react-bootstrap'

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

    <div className='past-assignments'>
      {for plan in plans
        <CloneAssignmentLink key={plan.id} plan={plan} />}
    </div>

PastAssignmentsShell = React.createClass
  render: ->
    {courseId} = @props

    <LoadableItem
      id={courseId}
      store={PastTaskPlansStore}
      actions={PastTaskPlansActions}
      load={partial(PastTaskPlansActions.load, {courseId})}
      renderLoading={ PastAssignmentsLoading }
      renderItem={-> <PastAssignments courseId={courseId} />}
    />

module.exports = PastAssignmentsShell
