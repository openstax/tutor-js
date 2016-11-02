React = require 'react'
BS    = require 'react-bootstrap'
cn    = require 'classnames'

{ Draggable, Droppable } = require 'react-drag-and-drop'

isEmpty = require 'lodash/isEmpty'


{TeacherTaskPlanStore} = require '../../flux/teacher-task-plan'
BindStoreMixin = require '../bind-store-mixin'

EmptyWarning = (props) ->
  return null unless props.isVisible
  <div className="no-plans">
    No assignments were found
  </div>

Plan = ({plan}) ->
  <Draggable type="task" data={plan.id}>
    <div data-assignment-type={plan.type} className='task-plan'>
      <label>{plan.title}</label>
    </div>
  </Draggable>

CalendarSidebar = React.createClass

  propTypes:
    isOpen: React.PropTypes.bool.isRequired
    onHide: React.PropTypes.func.isRequired
    courseId: React.PropTypes.string.isRequired

  bindStore: TeacherTaskPlanStore

  render: ->
    plans = TeacherTaskPlanStore.get(@props.courseId) or []
    console.log plans
    <div className={cn('sidebar', {'is-open': @props.isOpen})}>
      <BS.Button className="hide-btn" bsStyle="primary" onClick={@props.onHide}>
        << Hide
      </BS.Button>
      <div className="assignments">
        <EmptyWarning isVisible={isEmpty(plans)} />

        {for plan in plans
          <Plan key={plan.id} plan={plan} />}


      </div>
    </div>

module.exports = CalendarSidebar
