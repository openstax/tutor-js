moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{Stats} = require '../task-plan/reading-stats'
LoadableItem = require '../loadable-item'

StatsModalShell = React.createClass
  render: ->
    <LoadableItem
      id={@props.id}
      store={TaskPlanStore}
      actions={TaskPlanActions}
      renderItem={=> <Stats {...@props}/>}
    />

# TODO drag and drop, and resize behavior
CoursePlanDetails = React.createClass
  displayName: 'CoursePlanDetails'

  propTypes:
    plan: React.PropTypes.object.isRequired

  contextTypes:
    router: React.PropTypes.func

  onClickEdit: ->
    {plan, courseId} = @props
    {title, type, id} = plan
    @context.router.transitionTo('editPlan', {courseId, id, type})

  render: ->
    {plan, courseId} = @props
    {title, type, id} = plan

    <BS.Modal {...@props} title={title} className="#{type}-modal plan-modal">
      <div className='modal-body'>
        <StatsModalShell id={id}/>
      </div>
      <div className='modal-footer'>
        <BS.Button onClick={@onClickEdit}>Edit {type}</BS.Button>
      </div>
    </BS.Modal>


module.exports = CoursePlanDetails
