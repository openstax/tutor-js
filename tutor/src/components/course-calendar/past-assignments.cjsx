React = require 'react'
BS    = require 'react-bootstrap'

{CloneAssignmentLink} = require './task-dnd'

isEmpty = require 'lodash/isEmpty'


{TeacherTaskPlanStore} = require '../../flux/teacher-task-plan'
BindStoreMixin = require '../bind-store-mixin'

EmptyWarning = (props) ->
  return null unless props.isVisible
  <div className="no-plans">
    No assignments were found
  </div>


PastAssignments = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired

  bindStore: TeacherTaskPlanStore

  render: ->
    plans = TeacherTaskPlanStore.get(@props.courseId) or []

    <div className='past-assignments'>
      <EmptyWarning isVisible={isEmpty(plans)} />

      {for plan in plans
        <CloneAssignmentLink key={plan.id} plan={plan} />}
    </div>

module.exports = PastAssignments
