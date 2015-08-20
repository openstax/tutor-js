React = require 'react'
moment = require 'moment'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'
PlanFooter = require './footer'
SelectTopics = require './select-topics'
ExerciseSummary = require './homework/exercise-summary'
PlanMixin = require './plan-mixin'
PinnedHeaderFooterCard = require '../pinned-header-footer-card'
TaskPlanBuilder = require './builder'

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
    {courseId, planId, selected, hide, cancel} = @props

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
          onCancel={cancel}
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
        cancel={cancel}
        hide={hide} />

      <PinnedHeaderFooterCard
        containerBuffer={50}
        header={exerciseSummary}
        cardType='homework-builder'>
        {addExercises}
      </PinnedHeaderFooterCard>
    </div>


HomeworkPlan = React.createClass
  displayName: 'HomeworkPlan'
  mixins: [PlanMixin]

  render: ->
    {id, courseId} = @props
    plan = TaskPlanStore.get(id)

    topics = TaskPlanStore.getTopics(id)
    hasExercises = TaskPlanStore.getExercises(id)?.length
    shouldShowExercises = hasExercises and not @state?.showSectionTopics

    if plan?.due_at
      dueAt = new Date(plan.due_at)

    footer = <PlanFooter id={id}
      courseId={courseId}
      onPublish={@publish}
      onSave={@save}
      onCancel={@cancel}
      goBackToCalendar={@goBackToCalendar}/>

    formClasses = ['edit-homework dialog']
    if @state?.showSectionTopics then formClasses.push('hide')
    if @state?.invalid then formClasses.push('is-invalid-form')

    dueAtElem = <TutorDateInput
                  id='homework-due-date'
                  label='Due Date'
                  required={true}
                  onChange={@setDueAt}
                  min={new Date()}
                  value={dueAt}/>

    if @state.showSectionTopics
      chooseExercises = <ChooseExercises
        courseId={courseId}
        planId={id}
        cancel={@cancelSelection}
        hide={@hideSectionTopics}
        selected={topics}/>

    if shouldShowExercises
      exerciseSummary = <ExerciseSummary
        onCancel={@cancel}
        onPublish={@publish}
        canAdd={not TaskPlanStore.isVisibleToStudents(id)}
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

      reviewExercisesSummary = <PinnedHeaderFooterCard
        containerBuffer={50}
        header={exerciseSummary}
        cardType='homework-builder'>
        {exerciseTable}
        {reviewExercises}
      </PinnedHeaderFooterCard>

    header = @builderHeader('homework')

    if not TaskPlanStore.isVisibleToStudents(id)
      addProblemsButton = <BS.Button id='problems-select'
        onClick={@showSectionTopics}
        bsStyle='default'>+ Select Problems
      </BS.Button>

    if (@state?.invalid and not hasExercises)
      problemsRequired = <span className="problems-required">
        Please add exercises to this assignment
        <i className="fa fa-exclamation-circle"></i>
      </span>

    <div className='homework-plan'>
      <BS.Panel bsStyle='default'
        header={header}
        className={formClasses.join(' ')}
        footer={footer}>

        <BS.Grid fluid>
          <TaskPlanBuilder courseId={courseId} id={id} />
          <BS.Row>
          <BS.Col xs=12 md=12>
            {addProblemsButton}
            {problemsRequired}
          </BS.Col>
          </BS.Row>
        </BS.Grid>
        
      </BS.Panel>
      {chooseExercises}
      {reviewExercisesSummary}
    </div>


module.exports = {HomeworkPlan}
