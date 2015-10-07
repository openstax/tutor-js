React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TaskPlanStatsStore, TaskPlanStatsActions} = require '../../flux/task-plan-stats'
LoadableItem = require '../loadable-item'
Markdown = require '../markdown'

Event = React.createClass
  propTypes:
    id: React.PropTypes.string.isRequired

  render: ->
    {id, courseId} = @props
    plan = TaskPlanStatsStore.get(id)
    periods = TaskPlanStatsStore.getPeriods(id)

    periodsNames = _.pluck(periods, 'name').join(', ')
    description = <Markdown text={plan.description} block={true}/> if plan.description

    <BS.Panel className='reading-stats'>
      <h3>For <strong>{periodsNames}</strong></h3>
      {description}
    </BS.Panel>

EventModalShell = React.createClass
  render: ->
    {id} = @props
    <LoadableItem
      id={id}
      store={TaskPlanStatsStore}
      actions={TaskPlanStatsActions}
      renderItem={=> <Event {...@props}/>}
    />

module.exports = {EventModalShell, Event}
