React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TaskPlanStatsStore, TaskPlanStatsActions} = require '../../flux/task-plan-stats'
LoadableItem = require '../loadable-item'
{SmartOverflow} = require 'shared'
{CoursePeriodsNav} = require '../course-periods-nav'

CourseBar = require './course-bar'
{ChaptersPerformance, PracticesPerformance} = require './performances'

PeriodHelper = require '../../helpers/period'

Stats = React.createClass
  propTypes:
    id: React.PropTypes.string.isRequired
    activeSection: React.PropTypes.string
    initialActivePeriodInfo: React.PropTypes.object
    handlePeriodSelect: React.PropTypes.func
    shouldOverflowData: React.PropTypes.bool

  getDefaultProps: ->
    initialActivePeriodInfo: {}
    shouldOverflowData: false

  getInitialState: ->
    {initialActivePeriodInfo, handlePeriodSelect} = @props

    stats = @getStatsForPeriod(initialActivePeriodInfo)
    stats: stats

  componentWillMount: ->
    {id, initialActivePeriodInfo, handlePeriodSelect} = @props

    periods = TaskPlanStatsStore.getPeriods(id)
    period = _.findWhere(periods, {id: initialActivePeriodInfo.id})

    handlePeriodSelect?(period)

  getInitialPeriodIndex: ->
    {id, initialActivePeriodInfo} = @props

    periods = TaskPlanStatsStore.getPeriods(id)
    periodIndex = _.findIndex(periods, {id: initialActivePeriodInfo.id})

    # return 0 if period not found.  otherwise, will return period index.
    Math.max(0, periodIndex)

  getStatsForPeriod: (periodInfo) ->
    {id} = @props
    plan = TaskPlanStatsStore.get(id)

    periodStats = _.findWhere(plan.stats, {period_id: periodInfo.id})

    # if there's no period matching id, return first of sorted periods
    periodStats or _.first(PeriodHelper.sort(plan.stats))

  handlePeriodSelect: (period) ->
    {handlePeriodSelect} = @props

    periodStats = @getStatsForPeriod(period)
    @setState(stats: periodStats)

    handlePeriodSelect?(period)

  render: ->
    {id, courseId, shouldOverflowData, activeSection} = @props
    {stats} = @state

    initialActivePeriodIndex = @getInitialPeriodIndex()

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
        initialActive={initialActivePeriodIndex}
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
