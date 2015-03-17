React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'

Stats = React.createClass
  mixins: [Router.State, Router.Navigation]

  getInitialState: ->
    id = @getParams().id
    if (id)
      TaskPlanActions.load(id)
    else
      id = TaskPlanStore.freshLocalId()
      plan = TaskPlanActions.create(id, due_at: new Date())

    {id}

  componentWillMount: -> TaskPlanStore.addChangeListener(@update)
  componentWillUnmount: -> TaskPlanStore.removeChangeListener(@update)

  getPlanId: () ->
    @getParams().id or @state.id

  update: -> @setState {}

  percent: (num,total) ->
    Math.round((num/total) * 100)

  percentDelta: (a,b) ->
    if a > b
      change = a - b
      op = '+'
    else
      change = b - a
      op = '-'
    op + ' ' + Math.round((change / b) * 100)

    
  
  renderCourseBar: (data) ->
    <div>
      <div className="reading-progress-heading">
        complete / in progress / not started
      </div>
      <BS.ProgressBar className="reading-progress-group">
        <BS.ProgressBar className="reading-progress-bar" bsStyle="success" label="%(now)s" max={data.total_count+1} now={data.complete_count} key={1} />
        <BS.ProgressBar className="reading-progress-bar" bsStyle="warning" label="%(now)s" max={data.total_count+1} now={data.partially_complete_count} key={2} />
        <BS.ProgressBar className="reading-progress-bar" bsStyle="danger" label="%(now)s" max={data.total_count+1} now={data.total_count - (data.complete_count + data.partially_complete_count)} key={3} />
      </BS.ProgressBar>
    </div> 

  renderChapterBars: (data, i) ->
    <div>
      <div className="reading-progress-heading">
        {data.page.number} - {data.page.title}
      </div>
      <BS.ProgressBar className="reading-progress-group">
        <BS.ProgressBar className="reading-progress-bar" bsStyle="success" label="%(percent)s%" now={@percent(data.correct_count,data.correct_count+data.incorrect_count)} key={1} />
        <BS.ProgressBar className="reading-progress-bar" bsStyle="warning" label="%(percent)s%" now={@percent(data.incorrect_count,data.correct_count+data.incorrect_count)} key={2} />
      </BS.ProgressBar>
    </div>

  render: ->
    id = @getPlanId()

    if TaskPlanStore.isLoaded(id)

      plan = TaskPlanStore.get(id)
      course = @renderCourseBar(plan.stats.course)
      chapters = _.map(plan.stats.course.current_pages, @renderChapterBars)

    
    <BS.Panel>
      {course}
      {chapters}
    </BS.Panel>



module.exports = Stats
