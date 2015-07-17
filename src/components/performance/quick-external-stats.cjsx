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
    "#{data.complete_count} clicked of #{data.total_count}"

  render: ->
    {id, className} = @props
    {stats} = @state

    className = "#{className} quick-external-stats"
    # A Draft does not contain any stats
    course = @renderStats(stats) if stats?

    <span className={className}>
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
