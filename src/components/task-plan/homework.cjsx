React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'
{DateTimePicker} = require 'react-widgets'

PlanFooter = require './footer'
ArbitraryHtmlAndMath = require '../html'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TocStore, TocActions} = require '../../flux/toc'
{ExerciseStore, ExerciseActions} = require '../../flux/exercise'

ExerciseCard = React.createClass
  toggleExercise: ->
    if TaskPlanStore.hasExercise(@props.planId, @props.exercise.id)
      TaskPlanActions.removeExercise(@props.planId, @props.exercise)
    else
      TaskPlanActions.addExercise(@props.planId, @props.exercise)

  renderAnswers: (answer) ->
    <li>
      <ArbitraryHtmlAndMath className="answer" block={false} html={answer.content_html} />
    </li>

  renderTags: (tag) ->
    <span className="-exercise-tag">{tag}</span>

  render: ->
    content = JSON.parse(@props.exercise.content)
    question = content.questions[0]
    renderedAnswers = _.map(question.answers, @renderAnswers)
    renderedTags = _.map(content.tags, @renderTags)
    active = TaskPlanStore.hasExercise(@props.planId, @props.exercise.id)

    toggleText = if not active then <span>+</span> else <span>-</span>
    header = <span><BS.Button bsStyle="primary" onClick={@toggleExercise} className="-add-exercise">{toggleText}</BS.Button></span>
    
    panelStyle = if active then "info" else "default"
    <BS.Col xs={12} md={6}>
      <BS.Panel bsStyle={panelStyle} header={header}>
        <ArbitraryHtmlAndMath className="-stimulus" block={true} html={content.stimulus_html} />
        <ArbitraryHtmlAndMath className="-stem" block={true} html={question.stem_html} />
        <ul>{renderedAnswers}</ul>
        <p>{renderedTags}</p>
      </BS.Panel>
    </BS.Col>

AddProblems = React.createClass
  componentWillMount:   -> ExerciseStore.addChangeListener(@update)
  componentWillUnmount: -> ExerciseStore.removeChangeListener(@update)

  update: ->
    @setState({})

  reviewClicked: ->

  renderExercise: (exercise) ->
    <ExerciseCard planId={@props.planId} exercise={exercise}/>
      
  render: ->
    {courseId, pageIds, hide} = @props

    unless @props.shouldShow
      return <span className="-no-modal"/>
    unless ExerciseStore.isLoaded(pageIds)
      ExerciseActions.load(courseId, pageIds)
      return <span className="-loading">Loading...</span>

    exercises = ExerciseStore.get(pageIds)

    if not exercises.length
      return <span className="-no-exercises">The sections you selected have no exercises.  Please select more sections.</span>

    renderedExercises = _.map(exercises, @renderExercise)
    <div>

      <BS.Grid>
        <BS.Row>
          {renderedExercises}
        </BS.Row>
      </BS.Grid>
    </div>

ExerciseSummary = React.createClass
  render: ->
    if not @props.shouldShow
      return <span></span>

    if @props.canReview and @props.numSelected
      button = <BS.Button bsStyle="primary" onClick={@props.reviewClicked}>Review</BS.Button>
    else if @props.canAdd
      button = <BS.Button bsStyle="primary" onClick={@props.addClicked}>Add</BS.Button>

    total = @props.numSelected + 3

    <BS.Panel className bsStyle="default">
      <BS.Grid>
        <BS.Row>
          <BS.Col sm={6} md={2} className="-selections-title">Selections</BS.Col>
          <BS.Col sm={6} md={2} className="-total"><h2>{total}</h2></BS.Col>
          <BS.Col sm={6} md={2} className="-num-selected"><h2>{@props.numSelected}</h2>My Selections</BS.Col>
          <BS.Col sm={6} md={2} className="-num-tutor"><h2>3</h2>Tutor Selections</BS.Col>
          <BS.Col sm={6} md={2} className="-tutor-added-later"><em>
            Tutor selections are added later to support spaced practice and personalized learning.
          </em></BS.Col>
          <BS.Col sm={6} md={2}>
            {button}
          </BS.Col>
        </BS.Row>
      </BS.Grid>
    </BS.Panel>

SectionTopic = React.createClass
  render: ->
    classes = ['section']
    classes.push('selected') if @props.active
    classes = classes.join(' ')

    <div key={@props.section.id} className={classes} onClick={@toggleSection}>
      <span className="-section-number">{@props.section.number}</span>
      <span className="-section-title">{@props.section.title}</span>
    </div>

  toggleSection: ->
    section = @props.section
    if (TaskPlanStore.hasTopic(@props.planId, section.id))
      TaskPlanActions.removeTopic(@props.planId, section.id)
    else
      TaskPlanActions.addTopic(@props.planId, section.id)

SelectTopics = React.createClass
  getInitialState: ->
    {courseId} = @props
    TocActions.load(courseId) unless TocStore.isLoaded()
    { }

  componentWillMount:   -> TocStore.addChangeListener(@update)
  componentWillUnmount: -> TocStore.removeChangeListener(@update)

  update: -> @setState({})

  renderSections: (section) ->
    active = TaskPlanStore.hasTopic(@props.planId, section.id)
    <SectionTopic active={active} section={section} planId={@props.planId} />

  renderChapterPanels: (chapter, i) ->
    sections = _.map(chapter.children, @renderSections)
    header =
      <h2 className="-chapter-title">
        <span className="-chapter-number">{chapter.number}</span>
        <span className="-chapter-title">{chapter.title}</span>
      </h2>

    <BS.Accordion>
      <BS.Panel key={chapter.id} header={header} eventKey={chapter.id}>
        {sections}
      </BS.Panel>
    </BS.Accordion>

  selectProblems: ->
    @setState({
      showProblems: true
    })

  render: ->
    {courseId, planId, selected, hide} = @props
    unless @props.shouldShow
      return <span className="-no-modal"/>
    unless TocStore.isLoaded()
      TocActions.load(courseId)
      return <span className="-loading">Loading...</span>

    chapters = _.map(TocStore.get(), @renderChapterPanels)
    buttonStyle = if selected?.length then 'primary' else 'disabled'
    shouldShowProblems = selected?.length and @state.showProblems
    selectedExercises = TaskPlanStore.getExercises(planId)

    if not @state.showProblems
      footer =
        <span>
          <BS.Button bsStyle={buttonStyle} onClick={@selectProblems}>Show Problems</BS.Button>
          <BS.Button bsStyle="link" onClick={hide}>Cancel</BS.Button>
        </span>

    <div>
      <BS.Panel footer={footer}>
        <div className="select-reading-modal">
          {chapters}
        </div>
      </BS.Panel>
      <ExerciseSummary
        shouldShow={shouldShowProblems} 
        canReview={true}
        reviewClicked={@props.hide}
        numSelected={selectedExercises.length}/>
      <AddProblems
        courseId={courseId} 
        planId={planId} 
        shouldShow={shouldShowProblems} 
        pageIds={selected}
        hide={@hideSectionTopics}/>
    </div>

HomeworkPlan = React.createClass
  getInitialState: ->
    {showSectionTopics: false}

  setDueAt: (value) ->
    {id} = @props
    TaskPlanActions.updateDueAt(id, value)

  setTitle: ->
    {id} = @props
    value = @refs.title.getDOMNode().value
    TaskPlanActions.updateTitle(id, value)

  setDescription: ->
    {id} = @props
    desc = @refs.description.getDOMNode().value
    TaskPlanActions.updateDescription(id, desc)
  
  showSectionTopics: ->
    @setState({
      showSectionTopics: true
    })

  hideSectionTopics: ->
    @setState({
      showSectionTopics: false
    })

  render: ->
    {id, courseId} = @props
    plan = TaskPlanStore.get(id)
    description = TaskPlanStore.getDescription(id)
    headerText = if TaskPlanStore.isNew(id) then 'Add Homework' else 'Edit Homework'
    topics = TaskPlanStore.getTopics(id)

    if plan?.due_at
      dueAt = new Date(plan.due_at)

    today = new Date(plan.due_at)
    footer = <PlanFooter id={id} courseId={courseId} clickedSelectProblem={@showSectionTopics}/>

    formClasses = ['-create-homework']
    if @state?.showSectionTopics then formClasses.push('hide')

    <div>
      <BS.Panel bsStyle='default' className={formClasses.join(' ')} footer={footer}>
        <h1>{headerText}</h1>
        <BS.Grid>
          <BS.Row>
            <BS.Col xs={12} md={6}>
              <div className="-homework-title">
                <label htmlFor="homework-title">Title</label>
                <input
                  ref="title"
                  id="homework-title"
                  type="text"
                  value={plan.title}
                  placeholder="Enter Title"
                  onChange={@setTitle} />
              </div>
              <div className="-homework-due-date">
                <label htmlFor="homework-due-date">Due Date</label>
                <DateTimePicker
                  id="homework-due-date"
                  format="MMM dd, yyyy"
                  time={false}
                  calendar={true}
                  readOnly={false}
                  onChange={@setDueAt}
                  min={today}
                  value={dueAt}/>
              </div>
            </BS.Col>
            <BS.Col xs={12} md={6}>
              <div className="-homework-description">
                <label htmlFor="homework-description">Description</label>
                <textarea ref="description" id="homework-description" onChange={@setDescription}>
                  {description}
                </textarea>
              </div>
            </BS.Col>
          </BS.Row>
        </BS.Grid>
      </BS.Panel>
      <SelectTopics 
        courseId={courseId} 
        planId={id} 
        shouldShow={@state.showSectionTopics} 
        hide={@hideSectionTopics}
        selected={topics}/>
    </div>


module.exports = {HomeworkPlan}
