React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require '../../helpers/router'

{TaskPlanStatsStore, TaskPlanStatsActions} = require '../../flux/task-plan-stats'
LoadableItem = require '../loadable-item'
{SmartOverflow} = require 'shared'
{CoursePeriodsNav} = require '../course-periods-nav'
CourseGroupingLabel = require '../course-grouping-label'
CourseBar = require './course-bar'
{ChaptersPerformance, PracticesPerformance} = require './performances'

PeriodHelper = require '../../helpers/period'
TutorLink = require '../link'

NoStudents = ({courseId}) ->
  <span className='no-students'>
    <p>
      No students have been given this assignment. It will be
      automatically assigned to students when they join the
      course’s <CourseGroupingLabel courseId={courseId} lowercase/>.
    </p>
    <p>
      You can find the enrollment URL for students in
      the <TutorLink to='courseSettings' params={{courseId}}>Course Settings and Roster</TutorLink>.
    </p>
  </span>

NoStudents.displayName = 'NoStudents'

Stats = React.createClass
  displayName: 'Stats'
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

    if stats
      course = <CourseBar data={stats} type={plan.type}/>

      if _.isArray(stats.current_pages)
        chapters = <ChaptersPerformance currentPages={stats.current_pages} activeSection={activeSection}/>

      if _.isArray(stats.spaced_pages)
        practice = <PracticesPerformance spacedPages={stats.spaced_pages} activeSection={activeSection}/>

    else # no stats are available because the plan doesn't have students
      course = <NoStudents courseId={courseId} />

    if shouldOverflowData
      dataComponent = <SmartOverflow className='task-stats-data' heightBuffer={24}>
        <section>
          {course}
        </section>
        {chapters}
        {practice}
      </SmartOverflow>
    else
      dataComponent = <div className='task-stats-data'>
        <section>
          {course}
        </section>
        {chapters}
        {practice}
      </div>

    <BS.Panel className='task-stats'>
      <CoursePeriodsNav
        handleSelect={@handlePeriodSelect}
        initialActive={initialActivePeriodIndex}
        periods={periods}
        courseId={courseId} />
      {dataComponent}
    </BS.Panel>

StatsShell = React.createClass
  displayName: 'StatsShell'
  getId: -> RoutercurrentParams().id

  render: ->
    id = @getId()

    <LoadableItem
      id={id}
      store={TaskPlanStatsStore}
      actions={TaskPlanStatsActions}
      renderItem={-> <Stats id={id} />}
    />

StatsModalShell = React.createClass
  displayName: 'StatsModalShell'

  render: ->
    {id} = @props
    <LoadableItem
      id={id}
      store={TaskPlanStatsStore}
      actions={TaskPlanStatsActions}
      renderItem={=> <Stats {...@props}/>}
    />

module.exports = {StatsShell, StatsModalShell, Stats}
