React = require 'react'
BS    = require 'react-bootstrap'

{CloneAssignmentLink} = require './task-dnd'

isEmpty = require 'lodash/isEmpty'

{PastTaskPlansActions, PastTaskPlansStore} = require '../../flux/past-task-plans'
BindStoreMixin = require '../bind-store-mixin'

EmptyWarning = (props) ->
  return null unless props.isVisible
  <div className="no-plans">
    No assignments were found
  </div>


PastAssignments = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired

  bindStore: PastTaskPlansStore

  componentWillMount: ->
    PastTaskPlansActions.load(courseId: @props.courseId)

  render: ->
    plans = PastTaskPlansStore.get(@props.courseId)

    <div className='past-assignments'>
      <EmptyWarning isVisible={isEmpty(plans)} />

      {for plan in plans
        <CloneAssignmentLink key={plan.id} plan={plan} />}
    </div>

module.exports = PastAssignments
