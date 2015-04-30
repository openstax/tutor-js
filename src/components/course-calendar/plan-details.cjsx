moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{Stats} = require '../task-plan/reading-stats'
Loadable = require '../loadable'

StatsModalShell = React.createClass
  render: ->
    {id} = @props
    TaskPlanActions.loadStats(id) unless TaskPlanStore.isStatsLoaded(id)

    <Loadable
      store={TaskPlanStore}
      isLoading={-> TaskPlanStore.isStatsLoading(id)}
      isLoaded={-> TaskPlanStore.isStatsLoaded(id)}
      isFailed={-> TaskPlanStore.isStatsFailed(id)}
      render={=> <Stats {...@props}/>}
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
    # TODO: Remove this copy/pasta
    switch type
      when 'homework'
        @context.router.transitionTo('editHomework', {courseId, id})
      when 'reading'
        @context.router.transitionTo('editReading', {courseId, id})
      else throw new Error("BUG: Unknown plan type '#{type}'")

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
