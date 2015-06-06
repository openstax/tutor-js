moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TaskPlanStatsStore, TaskPlanStatsActions} = require '../../flux/task-plan-stats'
{Stats} = require '../task-plan/reading-stats'
LoadableItem = require '../loadable-item'

StatsModalShell = React.createClass
  render: ->
    {id} = @props
    <LoadableItem
      id={id}
      store={TaskPlanStatsStore}
      actions={TaskPlanStatsActions}
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
    # TODO: Remove this copy/pasta
    switch type
      when 'homework'
        @context.router.transitionTo('editHomework', {courseId, id})
      when 'reading'
        @context.router.transitionTo('editReading', {courseId, id})
      else throw new Error("BUG: Unknown plan type '#{type}'")

  onClickReview: ->
    {plan, courseId} = @props
    {title, type, id} = plan
    @context.router.transitionTo('reviewTask', {courseId, id})

  render: ->
    {plan, courseId} = @props
    {title, type, id} = plan

    <BS.Modal {...@props} title={title} className="#{type}-modal plan-modal">
      <div className='modal-body'>
        <StatsModalShell id={id}/>
      </div>
      <div className='modal-footer'>
        <BS.Button onClick={@onClickReview}>Review Metrics</BS.Button>
        <BS.Button onClick={@onClickEdit}>Edit Assignment</BS.Button>
      </div>
    </BS.Modal>


module.exports = CoursePlanDetails
