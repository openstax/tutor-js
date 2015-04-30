React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
Loadable = require '../loadable'

Stats = React.createClass
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

  renderPercentBar: (data, type, correctOrIncorrect) ->
    correctOrIncorrect ?= 'correct'
    percentCorrect = @percent(data, correctOrIncorrect)

    bsStyles =
      'correct' : 'success'
      'incorrect' : 'danger'

    classes = 'reading-progress-bar'
    classes += ' no-progress' unless percentCorrect
    correct = <BS.ProgressBar 
              className={classes} 
              bsStyle={bsStyles[correctOrIncorrect]} 
              label='%(percent)s%' 
              now={percentCorrect} 
              key="page-progress-#{type}-#{data.id}-#{correctOrIncorrect}" />

  renderProgressBar: (data, type, index, previous) ->
    practice = <span className='reading-progress-student-count'>({data.student_count} students)</span>
    studentCount = if type is 'practice' then practice

    <div key="#{type}-bar-#{index}">
      <div className='reading-progress-heading'>
        {data.number} {data.title} {studentCount}
      </div>
      <div className='reading-progress-container'>
        <BS.ProgressBar className='reading-progress-group'>
          {@renderPercentBar(data, type, 'correct')}
          {@renderPercentBar(data, type, 'incorrect')}
        </BS.ProgressBar>
        {previous}
      </div>
    </div>

  renderCourseBar: (data, type) ->
    if type is 'homework' and data.mean_grade_percent
      classAverage =
        <BS.Row>
          <BS.Col xs={12}>
            <h3 className='reading-stats-average'>
              <small>Average:</small> {data.mean_grade_percent}%
            </h3>
          </BS.Col>
        </BS.Row>

    <BS.Grid className='data-container' key='course-bar'>
      {classAverage}
      <BS.Row>
        <BS.Col xs={4}>
          <label>Complete</label>
          <div className = 'data-container-value text-complete'>
            {data.complete_count}
          </div>
        </BS.Col>
        <BS.Col xs={4}>
          <label>In Progress</label>
          <div className = 'data-container-value text-in-progress'>
            {data.partially_complete_count}
          </div>
        </BS.Col>
        <BS.Col xs={4}>
          <label>Not Started</label>
          <div className = 'data-container-value text-not-started'>
            {data.total_count - (data.complete_count + data.partially_complete_count)}
          </div>
        </BS.Col>
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
      chapters = <section>{chapters}</section>

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
