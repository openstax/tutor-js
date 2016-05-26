React      = require 'react'
_          = require 'underscore'
BS         = require 'react-bootstrap'
Router     = require 'react-router'
classnames = require 'classnames'

Icon            = require '../icon'
PlanMixin       = require './plan-mixin'
ExerciseSummary = require './homework/exercise-summary'
PlanFooter      = require './footer'
TaskPlanBuilder = require './builder'
ChooseExercises = require './homework/choose-exercises'
ReviewExercises = require './homework/review-exercises'

{TutorInput, TutorDateInput, TutorTextArea} = require '../tutor-input'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'

HomeworkPlan = React.createClass

  mixins: [PlanMixin]

  setImmediateFeedback: (ev) ->
    TaskPlanActions.setImmediateFeedback( @props.id, ev.target.value is 'immediate' )

  render: ->
    {id, courseId} = @props
    plan = TaskPlanStore.get(id)
    ecosystemId = TaskPlanStore.getEcosystemId(id, courseId)

    topics = TaskPlanStore.getTopics(id)
    hasExercises = TaskPlanStore.getExercises(id)?.length

    formClasses = classnames('edit-homework dialog', {
      hide: @state.showSectionTopics
      'is-invalid-form': @state.invalid
    })

    <div className='homework-plan task-plan' data-assignment-type='homework'>
      <BS.Panel bsStyle='default'
        header={@builderHeader('homework')}
        className={formClasses}
        footer={<PlanFooter id={id}
          courseId={courseId}
          onPublish={@publish}
          onSave={@save}
          onCancel={@cancel}
          getBackToCalendarParams={@getBackToCalendarParams}
          goBackToCalendar={@goBackToCalendar}
        />}
      >

        <BS.Grid fluid>
          <TaskPlanBuilder courseId={courseId} id={id} />
          <BS.Row>
            <BS.Col xs=8>
              <div className="form-group">
                <label htmlFor="feedback-select">Show feedback</label>
                <select
                  onChange={@setImmediateFeedback}
                  value={if TaskPlanStore.isFeedbackImmediate(id) then 'immediate' else 'due_at'}
                  id="feedback-select" className="form-control"
                >
                  <option value="immediate">
                    instantly after the student answers each question
                  </option>
                  <option value="due_at">
                    only after due date/time passes
                  </option>
                </select>
              </div>
            </BS.Col>
          </BS.Row>
          <BS.Row>
            <BS.Col xs=12 md=12>
              {<BS.Button id='problems-select'
                className="-select-sections-btn"
                onClick={@showSectionTopics}
                bsStyle='default'>+ Select Problems
              </BS.Button> unless @state.isVisibleToStudents}
              {<span className="problems-required">
                Please add exercises to this assignment
                <Icon type='exclamation-circle' />
              </span> if @state.invalid and not hasExercises}
            </BS.Col>
          </BS.Row>
        </BS.Grid>

      </BS.Panel>

      <ChooseExercises
        isVisible={@state.showSectionTopics}
        courseId={courseId}
        planId={id}
        ecosystemId={ecosystemId}
        cancel={@cancelSelection}
        hide={@hideSectionTopics}
        canEdit={not @state.isVisibleToStudents}
        selected={topics}/>

      <ReviewExercises
        isVisible={hasExercises and not @state.showSectionTopics}
        canAdd={not @state.isVisibleToStudents}
        canEdit={not @state.isVisibleToStudents}
        courseId={courseId}
        sectionIds={topics}
        planId={id}
      />

    </div>


module.exports = {HomeworkPlan}
