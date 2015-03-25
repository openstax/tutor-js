React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
LoadableMixin = require '../loadable-mixin'

Stats = React.createClass
  mixins: [Router.State, Router.Navigation, LoadableMixin]

  getFlux: ->
    store: TaskPlanStore
    actions: TaskPlanActions

  getId: -> @getParams().id


  percent: (num,total) ->
    Math.round((num/total) * 100)

  percentDelta: (a,b) ->
    if a > b
      change = a - b
      op = '+'
    else if a == b
      change = 0
      op = ''
    else
      change = b - a
      op = '-'
    op + ' ' + Math.round((change / b) * 100)


  renderCourseBar: (data) ->
    <div className="reading-progress-container">
      <div className="reading-progress-heading">
        complete / in progress / not started
      </div>
      <BS.ProgressBar className="reading-progress-group">
        <BS.ProgressBar className="reading-progress-bar" bsStyle="success" label="%(now)s" now={data.complete_count} key={1} />
        <BS.ProgressBar className="reading-progress-bar" bsStyle="warning" label="%(now)s" now={data.partially_complete_count} key={2} />
        <BS.ProgressBar className="reading-progress-bar" bsStyle="danger" label="%(now)s" now={data.total_count - (data.complete_count + data.partially_complete_count)} key={3} />
      </BS.ProgressBar>
    </div>

  renderChapterBars: (data, i) ->
    if data.correct_count > 0
      correct = <BS.ProgressBar className="reading-progress-bar" bsStyle="success" label="%(percent)s%" now={@percent(data.correct_count,data.correct_count+data.incorrect_count)} key={1} />
    else
      correct = ' '
    <div>
      <div className="reading-progress-heading">
        {data.page.number} - {data.page.title}
      </div>
      <div className="reading-progress-container">
        <BS.ProgressBar className="reading-progress-group">
          {correct}
        </BS.ProgressBar>
      </div>
    </div>

  renderPracticeBars: (data, i) ->
    if data.previous_attempt
      previous = <div className="reading-progress-delta">{@percentDelta(data.correct_count,data.previous_attempt.correct_count)}% change</div>
    <div>
      <div className="reading-progress-heading">
        {data.page.number} - {data.page.title}
      </div>
      <div className="reading-progress-container">
        <BS.ProgressBar className="reading-progress-group">
          <BS.ProgressBar className="reading-progress-bar" bsStyle="success" label="%(now)s%" now={@percent(data.correct_count,data.correct_count+data.incorrect_count)} key={1} />
        </BS.ProgressBar>
        {previous}
      </div>
    </div>

  renderLoaded: ->

    id = @getId()


    if TaskPlanStore.isLoaded(id)

      plan = TaskPlanStore.get(id)
      course = @renderCourseBar(plan.stats.course)
      chapters = _.map(plan.stats.course.current_pages, @renderChapterBars)
      practice = _.map(plan.stats.course.spaced_pages, @renderPracticeBars)


    <BS.Panel className="reading-stats-container">
      <label>course:</label>
      {course}
      <label>chapters:</label>
      {chapters}
      <label>practice:</label>
      {practice}
    </BS.Panel>



module.exports = Stats
