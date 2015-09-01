React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
$ = require 'jquery'

ArbitraryHtmlAndMath = require '../../html'
ChapterSection = require '../chapter-section'
{ExerciseStore, ExerciseActions} = require '../../../flux/exercise'
{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
{TocStore} = require '../../../flux/toc'

ExerciseCardMixin =
  renderAnswers: (answer) ->
    classes = ['answers-answer']
    if answer.correctness is '1.0'
      classes.push('correct')

    <div className={classes.join(' ')}>
      <div className="answer-letter" />
      <ArbitraryHtmlAndMath className="answer" block={false} html={answer.content_html} />
    </div>

  renderTags: (tag) ->
    {content, isLO} = ExerciseStore.getTagContent(tag)
    classes = ['exercise-tag']

    if isLO
      classes = ['lo-tag']
      loLabel = 'LO: '

    <span className={classes.join(' ')}>{loLabel} {content}</span>

  renderExercise: ->
    content = @props.exercise.content
    question = content.questions[0]
    renderedAnswers = _(question.answers).chain()
      .sortBy('id')
      .map(@renderAnswers)
      .value()
    tags = _.clone @props.exercise.tags
    # Display the exercise uid as a tag
    tags.push(name: "ID: #{@props.exercise.content.uid}")
    renderedTags = _.map(_.sortBy(tags, 'name'), @renderTags)
    header = @renderHeader()
    panelStyle = @getPanelStyle()

    <BS.Panel
      className='card exercise'
      bsStyle={panelStyle}
      header={header}
      onClick={@toggleExercise}>
      <ArbitraryHtmlAndMath className='-stimulus' block={true} html={content.stimulus_html} />
      <ArbitraryHtmlAndMath className='stem' block={true} html={question.stem_html} />
      <div className='answers-table'>{renderedAnswers}</div>

      <div className='exercise-tags'>{renderedTags}</div>
    </BS.Panel>

ReviewExerciseCard = React.createClass
  displayName: 'ReviewExerciseCard'

  propTypes:
    planId: React.PropTypes.string.isRequired
    exercise: React.PropTypes.object.isRequired
    canEdit: React.PropTypes.bool
    index: React.PropTypes.number

  mixins: [ExerciseCardMixin]

  moveExerciseUp: ->
    TaskPlanActions.moveExercise(@props.planId, @props.exercise, -1)

  moveExerciseDown: ->
    TaskPlanActions.moveExercise(@props.planId, @props.exercise, 1)

  removeExercise: ->
    if confirm('Are you sure you want to remove this exercise?')
      TaskPlanActions.removeExercise(@props.planId, @props.exercise)

  getActionButtons: ->
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

    if @props.canEdit
      <span className="pull-right card-actions">
        {moveUp}
        {moveDown}
        <BS.Button onClick={@removeExercise} className="btn-xs -remove-exercise">
          <i className="fa fa-close"/>
        </BS.Button>
      </span>

  renderHeader: ->
    actionButtons = @getActionButtons()

    <span className="-exercise-header">
      <span className="exercise-number">{@props.index + 1}</span>
      {actionButtons}
    </span>

  getPanelStyle: ->
    "default"

  render: ->
    @renderExercise()

AddExerciseCard = React.createClass
  displayName: 'AddExerciseCard'

  propTypes:
    planId: React.PropTypes.string.isRequired
    exercise: React.PropTypes.object.isRequired

  mixins: [ExerciseCardMixin]

  toggleExercise: ->
    if TaskPlanStore.hasExercise(@props.planId, @props.exercise.id)
      TaskPlanActions.removeExercise(@props.planId, @props.exercise)
    else
      TaskPlanActions.addExercise(@props.planId, @props.exercise)

  renderHeader: ->
    active = TaskPlanStore.hasExercise(@props.planId, @props.exercise.id)
    classes = 'add-or-remove -add-exercise'
    classes = "#{classes} active" if active
    <div className={classes}></div>

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
    planId: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    canEdit: React.PropTypes.bool
    pageIds: React.PropTypes.array

  mixins: [ExercisesRenderMixin]

  renderExercise: (exercise, i) ->
    <ReviewExerciseCard
      index={i}
      planId={@props.planId}
      canEdit={@props.canEdit}
      exercise={exercise}/>

  render: ->
    load = @renderLoading()
    if (load)
      return load

    {courseId, pageIds, planId} = @props

    unless TaskPlanStore.getTopics(planId).length
      return <div className='-bug'>Failed loading exercises</div>

    exercise_ids = TaskPlanStore.getExercises(planId)
    exercises = _.map(exercise_ids, ExerciseStore.getExerciseById)
    renderedExercises = _.map(exercises, @renderExercise)

    <div className="card-list exercises">
      {renderedExercises}
    </div>

ExerciseTable = React.createClass
  displayName: "ExerciseTable"
  mixins: [ExercisesRenderMixin]
  propTypes:
    planId: React.PropTypes.string.isRequired

  renderExerciseRow: (exerciseId, index, hasTeks) ->
    {section, lo, tagString} = ExerciseStore.getTagStrings(exerciseId)
    content = ExerciseStore.getContent(exerciseId)

    if (hasTeks)
      teksString = ExerciseStore.getTeksString(exerciseId)
      unless teksString
        teksString = "-"

      teks = <td>{teksString}</td>

    <tr>
      <td className="exercise-number">{index + 1}</td>
      <td>
        <ChapterSection section={section}/>
      </td>
      <td className="ellipses">
        <ArbitraryHtmlAndMath block={false} html={content} />
      </td>
      <td className="ellipses">{lo}</td>
      {teks}
      <td className="ellipses">{tagString}</td>
    </tr>

  renderTutorRow: (index, hasTeks) ->
    if hasTeks
      teksColumn = <td>-</td>

    numSelected = TaskPlanStore.getExercises(@props.planId).length
    number = index + numSelected + 1

    <tr>
      <td className="exercise-number">{number}</td>
      <td>-</td>
      <td>Tutor Selection</td>
      {teksColumn}
      <td>-</td>
      <td>-</td>
    </tr>

  shouldShowTeks: (exerciseIds) ->
    findTek = (memo, id) ->
      teksString = ExerciseStore.getTeksString(id)
      memo or teksString

    _.reduce(exerciseIds, findTek, false)

  render: ->
    load = @renderLoading()
    if (load)
      return load

    tutorSelection = TaskPlanStore.getTutorSelections(@props.planId)
    exerciseIds = TaskPlanStore.getExercises(@props.planId)
    renderSelectedRow = @renderExerciseRow
    renderTutorRow = @renderTutorRow
    hasTeks = @shouldShowTeks(exerciseIds)
    if (hasTeks)
      teksHead = <td>TEKS</td>

    getExerciseRows =  (exerciseId, index) -> renderSelectedRow(exerciseId, index, hasTeks)
    getTutorRows = (index) -> renderTutorRow(index, hasTeks)

    <table className="exercise-table">
      <thead>
        <tr>
          <td></td>
          <td></td>
          <td>Problem Question</td>
          <td>Learning Objective</td>
          {teksHead}
          <td>Details</td>
        </tr>
      </thead>
      <tbody>
        {_.map(exerciseIds, getExerciseRows)}
        {_.times(tutorSelection, getTutorRows)}
      </tbody>
    </table>

AddExercises = React.createClass
  displayName: 'AddExercises'

  propTypes:
    planId: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    pageIds: React.PropTypes.array

  mixins: [ExercisesRenderMixin]

  renderExercise: (exercise) ->
    <AddExerciseCard
      planId={@props.planId}
      exercise={exercise}
      key="add-exercise-card-#{@props.planId}"/>

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

  renderSection: (key) ->
    section = TocStore.getSectionLabel(key)
    unless section
      return <BS.Row></BS.Row>

    <BS.Row>
      <BS.Col xs={12}>
        <label className='exercises-section-label'>
          <ChapterSection section={section.chapter_section}/> {section.title}
        </label>
      </BS.Col>
    </BS.Row>

  render: ->
    load = @renderLoading()
    if (load)
      return load

    {courseId, pageIds} = @props
    unless ExerciseStore.get(pageIds).length
      return <span className="-no-exercises">
        The sections you selected have no exercises.
        Please select more sections.
      </span>

    groups = ExerciseStore.getGroupedExercises(pageIds)
    renderExercise = @renderExercise
    renderSection = @renderSection
    renderInRows = @renderInRows

    renderedExercises = _.reduce(groups, (memo, exercises, key) ->
      section = renderSection(key)
      exerciseCards = _.map(exercises, renderExercise)
      memo.push(section)
      memo.concat(renderInRows(exerciseCards))
    , [])

    <BS.Grid className="add-exercise-list">
      {renderedExercises}
    </BS.Grid>


module.exports = {AddExercises, ReviewExercises, ExerciseTable}
