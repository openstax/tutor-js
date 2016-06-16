React      = require 'react'
_          = require 'underscore'
BS         = require 'react-bootstrap'
Router     = require 'react-router'
classnames = require 'classnames'

Icon            = require '../icon'
PlanMixin       = require './plan-mixin'
PlanFooter      = require './footer'
TaskPlanBuilder = require './builder'
ChooseExercises = require './homework/choose-exercises'
ReviewExercises = require './homework/review-exercises'
FeedbackSetting = require './feedback'

{TutorInput, TutorDateInput, TutorTextArea} = require '../tutor-input'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'

HomeworkPlan = React.createClass

  mixins: [PlanMixin]

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
              <FeedbackSetting id={id} showPopup={@state.isVisibleToStudents}/>
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

      {<ChooseExercises
        courseId={courseId}
        planId={id}
        ecosystemId={ecosystemId}
        cancel={@cancelSelection}
        hide={@hideSectionTopics}
        canEdit={not @state.isVisibleToStudents}
        selected={topics}
      /> if @state.showSectionTopics}

      {<ReviewExercises
        canAdd={not @state.isVisibleToStudents}
        canEdit={not @state.isVisibleToStudents}
        showSectionTopics={@showSectionTopics}
        courseId={courseId}
        sectionIds={topics}
        ecosystemId={ecosystemId}
        planId={id}
      /> if hasExercises and not @state.showSectionTopics}

    </div>


module.exports = {HomeworkPlan}
