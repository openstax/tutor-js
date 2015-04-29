React = require 'react'
moment = require 'moment'
BS = require 'react-bootstrap'
Router = require 'react-router'
PlanFooter = require './footer'
SelectTopics = require './select-topics'
ExerciseSummary = require './homework/exercise-summary'
{DateTimePicker} = require 'react-widgets'
{AddExercises, ReviewExercises} = require './homework/exercises'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{ExerciseStore, ExerciseActions} = require '../../flux/exercise'

ChooseExercises = React.createClass
  displayName: 'ChooseExercises'

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
        bsStyle="primary"
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

    <div className="homework-plan-exercise-select-topics">
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
    else if TaskPlanStore.isNew(id) and @context?.router?.getCurrentQuery().date
      dueAt = new Date(@context.router.getCurrentQuery().date)
      @setDueAt(dueAt)

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

      reviewExercises = <ReviewExercises
        courseId={courseId}
        pageIds={topics}
        planId={id}/>

    <div className='-homework-plan'>
      <BS.Panel bsStyle='default'
        header={headerText}
        className={formClasses.join(' ')}
        footer={footer}>

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
                <textarea
                  ref="description"
                  id="homework-description"
                  value={description}
                  onChange={@setDescription}>
                </textarea>
              </div>
            </BS.Col>
          </BS.Row>
        </BS.Grid>
      </BS.Panel>
      {chooseExercises}
      {exerciseSummary}
      {reviewExercises}
    </div>


module.exports = {HomeworkPlan}
