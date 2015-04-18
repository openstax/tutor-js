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
  getId: -> @props.id
  render: ->
    id = @getId()
    <LoadableItem
      id={id}
      store={TaskPlanStore}
      actions={TaskPlanActions}
      renderItem={=> <Stats id={id} />}
    />

# TODO drag and drop, and resize behavior
CoursePlanDetails = React.createClass
  displayName: 'CoursePlanDetails'

  propTypes:
    plan: React.PropTypes.object.isRequired

  contextTypes:
    router: React.PropTypes.func

  onViewStats: ->
    {plan, courseId} = @props
    {title, type, id} = plan
    @context.router.transitionTo('editPlan', {courseId, id, type: type})

  render: ->
    {plan, courseId} = @props
    {title, type, id} = plan

    <BS.Modal {...@props} title={title} className="#{type}-modal plan-modal">
      <div className='modal-body'>
        <StatsModalShell id={id}/>
      </div>
      <div className='modal-footer'>
        <BS.Button>Review Metrics</BS.Button>
        <BS.Button onClick={@onViewStats}>Edit Assignment</BS.Button>
        <BS.Button>Reference View</BS.Button>
      </div>
    </BS.Modal>


module.exports = CoursePlanDetails
