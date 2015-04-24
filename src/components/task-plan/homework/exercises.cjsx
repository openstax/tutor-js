React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'

ArbitraryHtmlAndMath = require '../../html'
{ExerciseStore, ExerciseActions} = require '../../../flux/exercise'
{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'

ExerciseCardMixin =
  renderAnswers: (answer) ->
    <div className="answers-answer">
      <div className="answer-letter" />
      <ArbitraryHtmlAndMath className="answer" block={false} html={answer.content_html} />
    </div>

  renderTags: (tag) ->
    <span className="exercise-tag">{tag}</span>

  renderExercise: ->
    content = JSON.parse(@props.exercise.content)
    question = content.questions[0]
    renderedAnswers = _.map(question.answers, @renderAnswers)
    renderedTags = _.map(content.tags, @renderTags)

    header = @renderHeader()
    panelStyle = @getPanelStyle()

    <BS.Panel className="card exercise" bsStyle={panelStyle} header={header}>
      <ArbitraryHtmlAndMath className="-stimulus" block={true} html={content.stimulus_html} />
      <ArbitraryHtmlAndMath className="-stem" block={true} html={question.stem_html} />
      <div className="answers-table">{renderedAnswers}</div>
      <div className="exercise-tags">{renderedTags}</div>
    </BS.Panel>

ReviewExerciseCard = React.createClass
  displayName: 'ReviewExerciseCard'

  propTypes:
    planId: React.PropTypes.any.isRequired
    exercise: React.PropTypes.object.isRequired
    index: React.PropTypes.number

  mixins: [ExerciseCardMixin]

  moveExerciseUp: ->
    TaskPlanActions.moveExercise(@props.planId, @props.exercise, -1)

  moveExerciseDown: ->
    TaskPlanActions.moveExercise(@props.planId, @props.exercise, 1)

  removeExercise: ->
    if confirm('Are you sure you want to remove this exercise?')
      TaskPlanActions.removeExercise(@props.planId, @props.exercise)

  renderHeader: ->
    unless @props.index is 0
      moveUp =
        <BS.Button onClick={@moveExerciseUp} className="btn-xs -move-exercise-up">
          <i className="fa fa-arrow-up"/>
        </BS.Button>

    # TODO: Add conditional logic for displaying this button
    moveDown =
      <BS.Button onClick={@moveExerciseDown} className="btn-xs -move-exercise-down">
        <i className="fa fa-arrow-down"/>
      </BS.Button>

    <span className="-exercise-header">
      <span className="-exercise-number">{@props.index + 1}</span>
      <span className="pull-right card-actions">
        {moveUp}
        {moveDown}
        <BS.Button onClick={@removeExercise} className="btn-xs -remove-exercise">
          <i className="fa fa-close"/>
        </BS.Button>
      </span>
    </span>

  getPanelStyle: ->
    "default"

  render: ->
    @renderExercise()

AddExerciseCard = React.createClass
  displayName: 'AddExerciseCard'

  propTypes:
    planId: React.PropTypes.any.isRequired
    exercise: React.PropTypes.object.isRequired

  mixins: [ExerciseCardMixin]

  toggleExercise: ->
    if TaskPlanStore.hasExercise(@props.planId, @props.exercise.id)
      TaskPlanActions.removeExercise(@props.planId, @props.exercise)
    else
      TaskPlanActions.addExercise(@props.planId, @props.exercise)

  renderHeader: ->
    active = TaskPlanStore.hasExercise(@props.planId, @props.exercise.id)
    toggleText = if not active then <span>+</span> else <span>-</span>
    <BS.Button bsStyle="primary" onClick={@toggleExercise} className="-add-exercise">{toggleText}</BS.Button>

  getPanelStyle: ->
    if TaskPlanStore.hasExercise(@props.planId, @props.exercise.id)
      return "info"
    else
      return "default"

  render: ->
    @renderExercise()

ExercisesRenderMixin =
  componentWillMount:   -> ExerciseStore.addChangeListener(@update)
  componentWillUnmount: -> ExerciseStore.removeChangeListener(@update)

  update: ->
    @setState({})

  renderLoading: ->
    {courseId, pageIds} = @props

    unless ExerciseStore.isLoaded(pageIds)
      ExerciseActions.load(courseId, pageIds)
      return <span className="-loading">Loading...</span>

    false


ReviewExercises = React.createClass
  displayName: 'ReviewExercises'

  propTypes:
    planId: React.PropTypes.any.isRequired
    courseId: React.PropTypes.any.isRequired
    pageIds: React.PropTypes.array

  mixins: [ExercisesRenderMixin]

  renderExercise: (exercise, i) ->
    <ReviewExerciseCard index={i} planId={@props.planId} exercise={exercise}/>

  render: ->
    load = @renderLoading()
    if (load)
      return load
    {courseId, pageIds, planId} = @props
    exercise_ids = TaskPlanStore.getExercises(planId)
    exercises = _.map(exercise_ids, ExerciseStore.getExerciseById)
    renderedExercises = _.map(exercises, @renderExercise)

    <div className="card-list exercises">
      {renderedExercises}
    </div>

AddExercises = React.createClass
  displayName: 'AddExercises'

  propTypes:
    planId: React.PropTypes.any.isRequired
    courseId: React.PropTypes.any.isRequired
    pageIds: React.PropTypes.array

  mixins: [ExercisesRenderMixin]

  renderExercise: (exercise) ->
    <AddExerciseCard planId={@props.planId} exercise={exercise}/>

  renderInRows: (renderedExercises) ->
    rows = []
    i = 0
    while i < renderedExercises.length
      left = renderedExercises[i]
      right = renderedExercises[i + 1]

      newRow =
        <BS.Row>
          <BS.Col xs={12} md={6}>{left}</BS.Col>
          <BS.Col xs={12} md={6}>{right}</BS.Col>
        </BS.Row>

      rows.push(newRow)

      i += 2
    rows

  render: ->
    load = @renderLoading()
    if (load)
      return load

    {courseId, pageIds} = @props
    exercises = ExerciseStore.get(pageIds)
    if not exercises.length
      return <span className="-no-exercises">
        The sections you selected have no exercises.
        Please select more sections.
      </span>

    renderedExercises = _.map(exercises, @renderExercise)

    <BS.Grid>
      {@renderInRows(renderedExercises)}
    </BS.Grid>


module.exports = {AddExercises, ReviewExercises}
