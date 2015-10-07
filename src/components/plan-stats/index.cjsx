React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TaskPlanStatsStore, TaskPlanStatsActions} = require '../../flux/task-plan-stats'
LoadableItem = require '../loadable-item'
SmartOverflow = require '../smart-overflow'
{CoursePeriodsNav} = require '../course-periods-nav'

CourseBar = require './course-bar'
{ChaptersPerformance, PracticesPerformance} = require './performances'

PeriodHelper = require '../../helpers/period'

Stats = React.createClass
  propTypes:
    id: React.PropTypes.string.isRequired
    activeSection: React.PropTypes.string
    initialActivePeriod: React.PropTypes.number.isRequired
    handlePeriodKeyUpdate: React.PropTypes.func
    handlePeriodSelect: React.PropTypes.func
    shouldOverflowData: React.PropTypes.bool

  getDefaultProps: ->
    initialActivePeriod: 0
    shouldOverflowData: false

  getInitialState: ->
    periodIndex = @props.initialActivePeriod
    stats = @getStatsForPeriodByIndex(periodIndex)

    stats: stats

  getStatsForPeriodByIndex: (periodIndex) ->
    {id} = @props
    plan = TaskPlanStatsStore.get(id)

    orderedStats = PeriodHelper.sort(plan.stats)
    periodStats = orderedStats[periodIndex]

  handlePeriodSelect: (period) ->
    {id, handlePeriodSelect} = @props
    plan = TaskPlanStatsStore.get(id)

    periodStats = _.findWhere(plan.stats, {period_id: period.id})
    @setState(stats: periodStats)

    handlePeriodSelect?(period)

  componentDidMount: ->
    {id, handlePeriodSelect} = @props
    periods = TaskPlanStatsStore.getPeriods(id)

    initialPeriod = periods[@props.initialActivePeriod]
    handlePeriodSelect?(initialPeriod)

  render: ->
    {id, courseId, shouldOverflowData, activeSection} = @props
    {stats} = @state

    plan = TaskPlanStatsStore.get(id)
    periods = TaskPlanStatsStore.getPeriods(id)

    # A Draft does not contain any stats
    if stats
      course = <CourseBar data={stats} type={plan.type}/>

      if _.isArray(stats.current_pages)
        chapters = <ChaptersPerformance currentPages={stats.current_pages} activeSection={activeSection}/>

      if _.isArray(stats.spaced_pages)
        practice = <PracticesPerformance spacedPages={stats.spaced_pages} activeSection={activeSection}/>

    else
      course = <span className='-no-data'>No Data (draft)</span>

    if shouldOverflowData
      dataComponent = <SmartOverflow className='reading-stats-data' heightBuffer={24}>
        <section>
          {course}
        </section>
        {chapters}
        {practice}
      </SmartOverflow>
    else
      dataComponent = <div className='reading-stats-data'>
        <section>
          {course}
        </section>
        {chapters}
        {practice}
      </div>

    <BS.Panel className='reading-stats'>
      <CoursePeriodsNav
        handleSelect={@handlePeriodSelect}
        handleKeyUpdate={@props.handlePeriodKeyUpdate}
        initialActive={@props.initialActivePeriod}
        periods={periods}
        courseId={courseId} />
      {dataComponent}
    </BS.Panel>

StatsShell = React.createClass
  contextTypes:
    router: React.PropTypes.func

  getId: -> @context.router.getCurrentParams().id

  render: ->
    id = @getId()

    <LoadableItem
      id={id}
      store={TaskPlanStatsStore}
      actions={TaskPlanStatsActions}
      renderItem={-> <Stats id={id} />}
    />

StatsModalShell = React.createClass
  render: ->
    {id} = @props
    <LoadableItem
      id={id}
      store={TaskPlanStatsStore}
      actions={TaskPlanStatsActions}
      renderItem={=> <Stats {...@props}/>}
    />

module.exports = {StatsShell, StatsModalShell, Stats}
