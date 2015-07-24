React = require 'react'
_ = require 'underscore'

{TaskPlanStatsStore, TaskPlanStatsActions} = require '../../flux/task-plan-stats'
LoadableItem = require '../loadable-item'

QuickStats = React.createClass
  propTypes:
    id: React.PropTypes.string.isRequired
    periodId: React.PropTypes.string.isRequired

  getInitialState: ->
    @getStatsByPeriod(@props)

  componentWillReceiveProps: (nextProps) ->
    stats = @getStatsByPeriod(nextProps)
    @setState(stats)

  getStatsByPeriod: (props) ->
    {periodId, id} = props

    plan = TaskPlanStatsStore.get(id)
    stats = _(plan.stats).findWhere(period_id: periodId)

    stats: stats

  renderStats: (data) ->
    "#{data.complete_count}/#{data.total_count} clicked"

  render: ->
    {id, className} = @props
    {stats} = @state

    classes = 'quick-external-stats'
    classes += " #{className}" if className?

    # A Draft does not contain any stats
    course = @renderStats(stats) if stats?

    <span className={classes}>
      {course}
    </span>

QuickStatsShell = React.createClass
  render: ->
    {id} = @props
    <LoadableItem
      id={id}
      store={TaskPlanStatsStore}
      actions={TaskPlanStatsActions}
      renderItem={=> <QuickStats {...@props}/>}
    />

module.exports = {QuickStats, QuickStatsShell}
