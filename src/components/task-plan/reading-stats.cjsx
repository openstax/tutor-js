React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
Loadable = require '../loadable'
ChapterSectionMixin = require '../chapter-section-mixin'

Stats = React.createClass
  propTypes:
    id: React.PropTypes.string.isRequired

  mixins: [ChapterSectionMixin]

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
    bsStyles =
      'correct' : 'success'
      'incorrect' : 'danger'

    classes = 'reading-progress-bar'
    classes += ' no-progress' unless percent

    label = "#{percent}%"
    label = "#{label} #{correctOrIncorrect}" if percent is 100

    correct = <BS.ProgressBar
                className={classes}
                bsStyle={bsStyles[correctOrIncorrect]}
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
    studentCount = <span className='reading-progress-student-count'>
        ({data.student_count} students)
      </span>

    <div key="#{type}-bar-#{index}" className='reading-progress'>
      <div className='reading-progress-heading'>
        <strong>
          <span className='text-success'>
            {@sectionFormat(data.chapter_section, @state.sectionSeparator)}
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

  render: ->
    {id} = @props

    plan = TaskPlanStore.getStats(id)
    course = @renderCourseBar(plan.stats.course, plan.type)
    chapters = _.map(plan.stats.course.current_pages, @renderChapterBars)
    practice = _.map(plan.stats.course.spaced_pages, @renderPracticeBars)

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

    <BS.Panel className='reading-stats'>
      <section>
        {course}
      </section>
      {chapters}
      {practice}
    </BS.Panel>

StatsShell = React.createClass
  contextTypes:
    router: React.PropTypes.func

  getId: -> @context.router.getCurrentParams().id

  render: ->
    id = @getId()
    TaskPlanActions.loadStats(id) unless TaskPlanStore.isStatsLoaded(id)

    <Loadable
      store={TaskPlanStore}
      isLoading={-> TaskPlanStore.isStatsLoading(id)}
      isLoaded={-> TaskPlanStore.isStatsLoaded(id)}
      isFailed={-> TaskPlanStore.isStatsFailed(id)}
      render={-> <Stats id={id} />}
    />

module.exports = {StatsShell, Stats}
