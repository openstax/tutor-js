React = require 'react'
_ = require 'underscore'
moment = require 'moment'
BS = require 'react-bootstrap'
Router = require 'react-router'
{DateTimePicker} = require 'react-widgets'

PlanFooter = require './footer'
ArbitraryHtmlAndMath = require '../html'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TocStore, TocActions} = require '../../flux/toc'
{ExerciseStore, ExerciseActions} = require '../../flux/exercise'

# Throttle events to only fire when a page is redrawn
throttle = (type, name, obj) ->
  obj = obj or window
  running = false
  func = () ->
    if running then return
    running = true
    requestAnimationFrame () ->
      obj.dispatchEvent(new CustomEvent(name))
      running = false

  obj.addEventListener(type, func)
  return func

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
      <span className="-exercise-number">{@props.index+1}</span>
      <span className="pull-right card-actions">
        {moveUp}
        {moveDown}
        <BS.Button onClick={@removeExercise} className="btn-xs -remove-exercise"><i className="fa fa-close"/></BS.Button>
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
    {courseId, pageIds, hide} = @props

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
    {courseId, pageIds, hide, planId} = @props
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
    hide: React.PropTypes.func.isRequired

  mixins: [ExercisesRenderMixin]

  renderExercise: (exercise) ->
    <AddExerciseCard planId={@props.planId} exercise={exercise}/>

  renderInRows: (renderedExercises) ->
    rows = []
    i=0
    while i < renderedExercises.length
      left = renderedExercises[i]
      right = renderedExercises[i+1]

      newRow =
        <BS.Row>
          <BS.Col xs={12} md={6}>{left}</BS.Col>
          <BS.Col xs={12} md={6}>{right}</BS.Col>
        </BS.Row>

      rows.push(newRow)

      i+=2
    rows

  render: ->
    load = @renderLoading()
    if (load)
      return load

    {courseId, pageIds, hide} = @props
    exercises = ExerciseStore.get(pageIds)
    if not exercises.length
      return <span className="-no-exercises">The sections you selected have no exercises.  Please select more sections.</span>

    renderedExercises = _.map(exercises, @renderExercise)

    <BS.Grid>
      {@renderInRows(renderedExercises)}
    </BS.Grid>


ExerciseSummary = React.createClass
  displayName: 'ExerciseSummary'

  propTypes:
    planId: React.PropTypes.any.isRequired
    canAdd: React.PropTypes.bool
    addClicked: React.PropTypes.func.isRequired

  addTutorSelection: ->
    TaskPlanActions.updateTutorSelection(@props.planId, 1)

  removeTutorSelection: ->
    TaskPlanActions.updateTutorSelection(@props.planId, -1)

  componentDidMount: () ->
    el = @getDOMNode()
    @staticPosition = @getPosition(el)
    @handleScroll() # Update scroll position immediately on mount
    @optimizedScrollFunc = throttle('scroll', 'optimizedScroll')
    window.addEventListener('optimizedScroll', @handleScroll)

  componentWillUnmount: () ->
    window.removeEventListener('scroll', @optimizedScrollFunc)
    window.removeEventListener('optimizedScroll', @handleScroll)

  getPosition: (el) -> el.getBoundingClientRect().top - document.body.getBoundingClientRect().top

  handleScroll: (e) ->
    el = @getDOMNode()

    if document.body.scrollTop + 60 > @staticPosition
      el.classList.add('navbar', 'navbar-fixed-top', 'navbar-fixed-top-lower')
      document.body.style.marginTop = '120px'
    else
      el.classList.remove('navbar', 'navbar-fixed-top', 'navbar-fixed-top-lower')
      document.body.style.marginTop = '0'
      @staticPosition = @getPosition(el)

  render: ->
    numSelected = TaskPlanStore.getExercises(@props.planId).length
    numTutor = TaskPlanStore.getTutorSelections(@props.planId)
    total = numSelected + numTutor

    if @props.canReview and numSelected
      button = <BS.Button bsStyle="primary" className="-review-exercises"  onClick={@props.reviewClicked}>Review</BS.Button>
    else if @props.canAdd
      button = <BS.Button bsStyle="primary" className="-add-exercises" onClick={@props.addClicked}>Add</BS.Button>

    if TaskPlanStore.canDecreaseTutorExercises(@props.planId)
      removeSelection =
        <BS.Button onClick={@removeTutorSelection} className="btn-xs -move-exercise-down">
          <i className="fa fa-arrow-down"/>
        </BS.Button>

    if TaskPlanStore.canIncreaseTutorExercises(@props.planId)
      addSelection =
        <BS.Button onClick={@addTutorSelection} className="btn-xs -move-exercise-up">
          <i className="fa fa-arrow-up"/>
        </BS.Button>

    <BS.Panel className="exercise-summary" bsStyle="default">
      <BS.Grid>
        <BS.Row>
          <BS.Col sm={6} md={2} className="selections-title">Selections</BS.Col>
          <BS.Col sm={6} md={2} className="total"><h2>{total}</h2></BS.Col>
          <BS.Col sm={6} md={2} className="num-selected"><h2>{numSelected}</h2>My Selections</BS.Col>
          <BS.Col sm={6} md={2} className="num-tutor">
            <h2>
              {removeSelection}
              <span>{numTutor}</span>
              {addSelection}
            </h2>
            Tutor Selections
          </BS.Col>
          <BS.Col sm={6} md={2} className="tutor-added-later"><em>
            Tutor selections are added later to support spaced practice and personalized learning.
          </em></BS.Col>
          <BS.Col sm={6} md={2}>
            {button}
          </BS.Col>
        </BS.Row>
      </BS.Grid>
    </BS.Panel>

SectionTopic = React.createClass
  displayName: 'SectionTopic'

  propTypes:
    planId: React.PropTypes.any.isRequired
    section: React.PropTypes.object.isRequired
    active: React.PropTypes.bool

  render: ->
    classes = ['section']
    classes.push('selected') if @props.active
    isChecked = 'checked' if @props.active
    classes = classes.join(' ')

    <div key={@props.section.id} className={classes} onClick={@toggleSection}>
      <span className="-section-checkbox">
        <input type="checkbox" checked={isChecked}/>
      </span>
      <span className="-section-number">{@props.section.number}</span>
      <span className="-section-title">{@props.section.title}</span>
    </div>

  toggleSection: ->
    section = @props.section
    if (TaskPlanStore.hasTopic(@props.planId, section.id))
      TaskPlanActions.removeTopic(@props.planId, section.id)
    else
      TaskPlanActions.addTopic(@props.planId, section.id)

ChapterAccordion = React.createClass
  displayName: 'ChapterAccordion'

  propTypes:
    planId: React.PropTypes.any.isRequired
    courseId: React.PropTypes.any.isRequired
    chapter: React.PropTypes.object.isRequired
    hide: React.PropTypes.func.isRequired
    selected: React.PropTypes.array

  renderSections: (section) ->
    active = TaskPlanStore.hasTopic(@props.planId, section.id)
    <SectionTopic active={active} section={section} planId={@props.planId} />

  areAllSectionsSelected: (allSelected, section) ->
    @props.selected.indexOf(section.id) >= 0 and allSelected

  toggleAllSections: (e) ->
    if e.target.checked
      action = TaskPlanActions.addTopic
    else
      action = TaskPlanActions.removeTopic

    planId = @props.planId
    _.each @props.chapter.children, (section) ->
      action(planId, section.id)

  areAnySectionsSelected: (anySelected, section) ->
    @props.selected.indexOf(section.id) >= 0 or anySelected

  render: ->
    chapter = @props.chapter
    sections = _.map(chapter.children, @renderSections)
    allChecked = _.reduce(chapter.children, @areAllSectionsSelected, true)
    expandAccordion = _.reduce(chapter.children, @areAnySectionsSelected, true) or @props.i is 0
    activeKey = chapter.id if expandAccordion

    header =
      <h2 className="-chapter-title">
        <span className="-chapter-checkbox">
          <input type="checkbox" id="chapter-checkbox-#{chapter.id}"
            onChange={@toggleAllSections} checked={allChecked}/>
        </span>
        <span className="-chapter-number">{chapter.number}</span>
        <span className="-chapter-title">{chapter.title}</span>
      </h2>

    <BS.Accordion activeKey={activeKey}>
      <BS.Panel key={chapter.id} header={header} eventKey={chapter.id}>
        {sections}
      </BS.Panel>
    </BS.Accordion>

SelectTopics = React.createClass
  displayName: 'SelectTopics'
  propTypes:
    planId: React.PropTypes.any.isRequired
    courseId: React.PropTypes.any.isRequired
    hide: React.PropTypes.func.isRequired
    selected: React.PropTypes.array

  getInitialState: ->
    {courseId} = @props
    TocActions.load(courseId) unless TocStore.isLoaded()
    { }

  componentWillMount:   -> TocStore.addChangeListener(@update)
  componentWillUnmount: -> TocStore.removeChangeListener(@update)

  update: -> @setState({})


  renderChapterPanels: (chapter, i) ->
    <ChapterAccordion {...@props} chapter={chapter}/>

  selectProblems: ->
    @setState({
      showProblems: true
    })

  render: ->
    {courseId, planId, selected, hide} = @props
    unless TocStore.isLoaded()
      TocActions.load(courseId)
      return <span className="-loading">Loading...</span>

    selected = TaskPlanStore.getTopics(planId)
    chapters = _.map(TocStore.get(), @renderChapterPanels)
    buttonStyle = if selected?.length then 'primary' else 'disabled'
    shouldShowExercises = selected?.length and @state.showProblems

    if not @state.showProblems
      footer =
        <span>
          <BS.Button className="-show-problems" bsStyle={buttonStyle} onClick={@selectProblems}>Show Problems</BS.Button>
          <BS.Button bsStyle="link" onClick={hide}>Cancel</BS.Button>
        </span>

    header = <h1>
      Add Problems
      <BS.Button bsStyle="link" className="pull-right -close-reading" onClick={hide}>X</BS.Button>
    </h1>

    if shouldShowExercises
      exerciseSummary = <ExerciseSummary
          canReview={true}
          reviewClicked={hide}
          planId={planId}/>

      addExercises = <AddExercises
          courseId={courseId}
          planId={planId}
          pageIds={selected}
          hide={@hideSectionTopics}/>

    <div className="-homework-plan-exercise-select-topics">
      <BS.Panel header={header} footer={footer}>
        <div className="select-reading-modal">
          {chapters}
        </div>
      </BS.Panel>
      {exerciseSummary}
      {addExercises}
    </div>

HomeworkPlan = React.createClass
  contextTypes:
    router: React.PropTypes.func

  displayName: 'HomeworkPlan'

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
    shouldShowExercises = TaskPlanStore.getExercises(id)?.length and not @state?.showSectionTopics

    if plan?.due_at
      dueAt = new Date(plan.due_at)

    if TaskPlanStore.isNew(id) and @context?.router?.getCurrentQuery().date
      dueAt = new Date(@context.router.getCurrentQuery().date)

    footer = <PlanFooter id={id} courseId={courseId} clickedSelectProblem={@showSectionTopics}/>

    formClasses = ['edit-homework']
    if @state?.showSectionTopics then formClasses.push('hide')

    if (TaskPlanStore.isPublished(id))
      dueAtElem = <span>{new moment(dueAt).format('MMM Do, YYYY')}</span>
    else
      dueAtElem = <DateTimePicker
                    id="homework-due-date"
                    format="MMM dd, yyyy"
                    time={false}
                    calendar={true}
                    readOnly={false}
                    onChange={@setDueAt}
                    min={new Date()}
                    value={dueAt}/>

    if @state.showSectionTopics
      selectTopics = <SelectTopics
        courseId={courseId}
        planId={id}
        hide={@hideSectionTopics}
        selected={topics}/>

    if shouldShowExercises
      exerciseSummary = <ExerciseSummary
        canAdd={not TaskPlanStore.isPublished(id)}
        addClicked={@showSectionTopics}
        planId={id}/>

      reviewExercises = <ReviewExercises
        courseId={courseId}
        pageIds={topics}
        planId={id}/>

    <div className='-homework-plan'>
      <BS.Panel bsStyle='default' header={headerText} className={formClasses.join(' ')} footer={footer}>
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
                {dueAtElem}
                <p>Feedback will be released after the due date.</p>
              </div>
            </BS.Col>
            <BS.Col xs={12} md={6}>
              <div className="-homework-description">
                <label htmlFor="homework-description">Description</label>
                <textarea ref="description" id="homework-description" value={description} onChange={@setDescription}>
                </textarea>
              </div>
            </BS.Col>
          </BS.Row>
        </BS.Grid>
      </BS.Panel>
      {selectTopics}
      {exerciseSummary}
      {reviewExercises}
    </div>


module.exports = {HomeworkPlan}
