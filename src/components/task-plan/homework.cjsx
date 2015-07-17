React = require 'react'
moment = require 'moment'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'
PlanFooter = require './footer'
Close = require '../close'
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
          onCancel={hide}
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
    headerText = if TaskPlanStore.isNew(id) then 'Add Homework Assignment' else 'Edit Homework Assignment'
    closeBtn = <Close onClick={@cancel}/>
    topics = TaskPlanStore.getTopics(id)
    shouldShowExercises = TaskPlanStore.getExercises(id)?.length and not @state?.showSectionTopics

    if plan?.due_at
      dueAt = new Date(plan.due_at)

    footer = <PlanFooter id={id}
      courseId={courseId}
      onPublish={@publish}
      onSave={@save}/>

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

    header = [headerText, closeBtn]

    <div className='homework-plan'>
      <BS.Panel bsStyle='default'
        header={header}
        className={formClasses.join(' ')}
        footer={footer}>

        <BS.Grid fluid>
          <TaskPlanBuilder courseId={courseId} id={id} />
        </BS.Grid>
        <BS.Row>
          <BS.Button
            bsStyle='primary'
            className='-select-problems'
            onClick={@showSectionTopics}>Select Problems
          </BS.Button>
        </BS.Row>
      </BS.Panel>
      {chooseExercises}
      {reviewExercisesSummary}
    </div>


module.exports = {HomeworkPlan}
