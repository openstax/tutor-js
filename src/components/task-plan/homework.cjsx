React = require 'react'
moment = require 'moment'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'
PlanFooter = require './footer'
SelectTopics = require './select-topics'
ExerciseSummary = require './homework/exercise-summary'
{TutorInput, TutorDateInput, TutorTextArea} = require '../tutor-input'
{AddExercises, ReviewExercises, ExerciseTable} = require './homework/exercises'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{ExerciseStore, ExerciseActions} = require '../../flux/exercise'

ChooseExercises = React.createClass
  displayName: 'ChooseExercises'

  propTypes:
    planId: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    selected: React.PropTypes.array.isRequired
    hide: React.PropTypes.func.isRequired

  selectProblems: ->
    @setState({
      showProblems: true
    })

  render: ->
    {courseId, planId, selected, hide} = @props

    header = <span>Add Problems</span>
    selected = TaskPlanStore.getTopics(planId)
    shouldShowExercises = @props.selected?.length and @state?.showProblems
    classes = ['-show-problems']
    classes.push('disabled') unless selected?.length
    classes = classes.join(' ')

    primary =
      <BS.Button
        className={classes}
        bsStyle='primary'
        onClick={@selectProblems}>Show Problems
      </BS.Button>

    if shouldShowExercises
      exerciseSummary = <ExerciseSummary
          canReview={true}
          reviewClicked={hide}
          planId={planId}/>

      addExercises = <AddExercises
          courseId={courseId}
          planId={planId}
          pageIds={selected}/>

    <div className='homework-plan-exercise-select-topics'>
      <SelectTopics
        primary={primary}
        header={header}
        courseId={courseId}
        planId={planId}
        selected={selected}
        hide={hide} />

      {exerciseSummary}
      {addExercises}
    </div>



HomeworkPlan = React.createClass
  contextTypes:
    router: React.PropTypes.func

  displayName: 'HomeworkPlan'

  getInitialState: ->
    dateStr = @context?.router?.getCurrentQuery()?.date?.replace(/-/g, ' ')
    if TaskPlanStore.isNew(@props.id) and dateStr
      dueAt = new Date(dateStr)
      @setDueAt(dueAt)
    {showSectionTopics: false}

  setDueAt: (value) ->
    {id} = @props
    TaskPlanActions.updateDueAt(id, value)

  setTitle:(title, titleNode) ->
    {id} = @props
    TaskPlanActions.updateTitle(id, title)

  setDescription:(desc, descNode) ->
    {id} = @props
    TaskPlanActions.updateDescription(id, desc)

  showSectionTopics: ->
    @setState({
      showSectionTopics: true
    })

  hideSectionTopics: ->
    @setState({
      showSectionTopics: false
    })

  cancel: ->
    {id} = @props
    TaskPlanActions.reset(id)
    @context.router.transitionTo('dashboard')

  render: ->
    {id, courseId} = @props
    plan = TaskPlanStore.get(id)
    description = TaskPlanStore.getDescription(id)
    headerText = if TaskPlanStore.isNew(id) then 'Add Homework Assignment' else 'Edit Homework Assignment'
    closeBtn = <BS.Button className='close-icon' aria-role='close' onClick={@cancel}>X</BS.Button>
    topics = TaskPlanStore.getTopics(id)
    shouldShowExercises = TaskPlanStore.getExercises(id)?.length and not @state?.showSectionTopics

    if plan?.due_at
      dueAt = new Date(plan.due_at)

    footer = <PlanFooter id={id} courseId={courseId} clickedSelectProblem={@showSectionTopics}/>

    formClasses = ['edit-homework dialog']
    if @state?.showSectionTopics then formClasses.push('hide')

    if (TaskPlanStore.isPublished(id))
      dueAtElem = <span>Due Date: {new moment(dueAt).format('MMM Do, YYYY')}</span>
    else
      dueAtElem = <TutorDateInput
                    id='homework-due-date'
                    format='MMM dd, yyyy'
                    time={false}
                    label='Due Date'
                    calendar={true}
                    readOnly={false}
                    className="form-control"
                    onChange={@setDueAt}
                    min={new Date()}
                    value={dueAt}/>

    if @state.showSectionTopics
      chooseExercises = <ChooseExercises
        courseId={courseId}
        planId={id}
        hide={@hideSectionTopics}
        selected={topics}/>

    if shouldShowExercises
      exerciseSummary = <ExerciseSummary
        canAdd={not TaskPlanStore.isPublished(id)}
        addClicked={@showSectionTopics}
        planId={id}/>

      exerciseTable = <ExerciseTable
        courseId={courseId}
        pageIds={topics}
        planId={id}/>

      reviewExercises = <ReviewExercises
        courseId={courseId}
        pageIds={topics}
        planId={id}/>

    header = [headerText, closeBtn]

    <div className='homework-plan'>
      <BS.Panel bsStyle='default'
        header={header}
        className={formClasses.join(' ')}
        footer={footer}>

        <BS.Grid>
          <BS.Row>
            <BS.Col xs={12} md={8}>
              <div className='-homework-title'>
                <TutorInput
                  label='Name'
                  id='homework-title'
                  default={plan.title}
                  onChange={@setTitle} />
              </div>
            </BS.Col>
            <BS.Col xs={12} md={4}>
              {dueAtElem}
              <p>Feedback will be released after the due date.</p>
            </BS.Col>
            <BS.Col xs={12} md={12}>
              <TutorTextArea
                label='Description'
                id='homework-description'
                default={description}
                onChange={@setDescription} />
            </BS.Col>
          </BS.Row>
        </BS.Grid>
      </BS.Panel>
      {chooseExercises}
      {exerciseSummary}
      {exerciseTable}
      {reviewExercises}
    </div>


module.exports = {HomeworkPlan}
