React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TaskPlanStatsStore, TaskPlanStatsActions} = require '../../flux/task-plan-stats'
LoadableItem = require '../loadable-item'
SmartOverflow = require '../smart-overflow'
ChapterSectionMixin = require '../chapter-section-mixin'
{CoursePeriodsNavShell} = require '../course-periods-nav'

Stats = React.createClass
  propTypes:
    id: React.PropTypes.string.isRequired
    activeSection: React.PropTypes.string
    shouldOverflowData: React.PropTypes.bool

  mixins: [ChapterSectionMixin]

  getDefaultProps: ->
    shouldOverflowData: false

  getInitialState: ->
    periodIndex = 0
    stats = @getStatsForPeriodByIndex(periodIndex)

    stats: stats

  _percent: (num, total) ->
    Math.round((num / total) * 100)

  percentDelta: (a, b) ->
    if a > b
      change = a - b
      op = '+'
    else if a is b
      change = 0
      op = ''
    else
      change = b - a
      op = '-'
    op + ' ' + Math.round((change / b) * 100)

  percent: (data, correctOrIncorrect) ->
    correctOrIncorrect ?= 'correct'
    count = correctOrIncorrect + '_count'

    total_count = data.correct_count + data.incorrect_count
    if total_count then @_percent(data[count], total_count) else 0

  renderPercentBar: (data, type, percent, correctOrIncorrect) ->
    classes = 'reading-progress-bar'
    classes += " progress-bar-#{correctOrIncorrect}"
    classes += ' no-progress' unless percent

    label = "#{percent}%"
    label = "#{label} #{correctOrIncorrect}" if percent is 100

    correct = <BS.ProgressBar
                className={classes}
                label={label}
                now={percent}
                key="page-progress-#{type}-#{data.id}-#{correctOrIncorrect}"
                type="#{correctOrIncorrect}"
                alt="#{percent}% #{correctOrIncorrect}"/>

  renderPercentBars: (data, type) ->
    percents =
      correct: @percent(data, 'correct')
      incorrect: @percent(data, 'incorrect')

    # make sure percents add up to 100
    if percents.incorrect + percents.correct > 100
      percents.incorrect = 100 - percents.correct

    _.map percents, (percent, correctOrIncorrect) =>
      @renderPercentBar(data, type, percent, correctOrIncorrect)

  renderProgressBar: (data, type, index, previous) ->
    {activeSection} = @props

    studentCount = <span className='reading-progress-student-count'>
        ({data.student_count} students)
      </span>

    sectionLabel = @sectionFormat(data.chapter_section, @state.sectionSeparator)

    active = activeSection is sectionLabel

    progressClass = 'reading-progress'
    progressClass = "#{progressClass} active" if active
    progressClass = "#{progressClass} inactive" if activeSection and not active

    <div key="#{type}-bar-#{index}" className={progressClass}>
      <div className='reading-progress-heading'>
        <strong>
          <span className='text-success'>
            {sectionLabel}
          </span> {data.title}
        </strong> {studentCount}
      </div>
      <div className='reading-progress-container'>
        <BS.ProgressBar className='reading-progress-group'>
          {@renderPercentBars(data, type)}
        </BS.ProgressBar>
        {previous}
      </div>
    </div>

  renderCourseStat: (stat, cols = 4) ->
    key = "reading-stats-#{stat.type}"
    <BS.Col xs={cols} className={key} key={key}>
      <label>{stat.label}</label>
      <div className = "data-container-value text-#{stat.type}">
        {stat.value}
      </div>
    </BS.Col>

  renderCourseBar: (data, type) ->
    cols = 4
    stats = [{
        type: 'complete'
        label: 'Complete'
        value: data.complete_count
      }, {
        type: 'in-progress'
        label: 'In Progress'
        value: data.partially_complete_count
      }, {
        type: 'not-started'
        label: 'Not Started'
        value: data.total_count - (data.complete_count + data.partially_complete_count)
    }]

    if type is 'homework' and data.mean_grade_percent
      stats.unshift(
        type: 'average'
        label: 'Average'
        value: "#{data.mean_grade_percent}%"
      )

    cols = 12 / stats.length
    statsColumns = _.map stats, (stat) =>
      @renderCourseStat(stat, cols)

    <BS.Grid className='data-container' key='course-bar'>
      <BS.Row>
        {statsColumns}
      </BS.Row>
    </BS.Grid>

  renderChapterBars: (data, i) ->
    @renderProgressBar(data, 'chapter', i)

  renderPracticeBars: (data, i) ->
    if data.previous_attempt
      previous =
        <div className='reading-progress-delta'>
          {@percentDelta(data.correct_count, data.previous_attempt.correct_count)}% change
        </div>
    @renderProgressBar(data, 'practice', i, previous)

  getStatsForPeriodByIndex: (periodIndex) ->
    {id} = @props
    plan = TaskPlanStatsStore.get(id)

    periodStats = plan.stats[periodIndex]

  handlePeriodSelect: (period) ->
    {id, handlePeriodSelect} = @props
    plan = TaskPlanStatsStore.get(id)

    periodStats = _.findWhere(plan.stats, {period_id: period.id})
    @setState(stats: periodStats)

    handlePeriodSelect?(period)

  render: ->
    {id, courseId, shouldOverflowData} = @props
    {stats} = @state

    plan = TaskPlanStatsStore.get(id)
    course = @renderCourseBar(stats, plan.type)
    chapters = _.map(stats.current_pages, @renderChapterBars)
    practice = _.map(stats.spaced_pages, @renderPracticeBars)

    unless _.isEmpty(chapters)
      chapters = <section>
        <label>Current Topics Performance</label>
        {chapters}
      </section>

    unless _.isEmpty(practice)
      practice = <section>
        <label>Space Practice Performance</label>
        {practice}
      </section>

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
      <CoursePeriodsNavShell
        handleSelect={@handlePeriodSelect}
        intialActive={@state.period}
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
