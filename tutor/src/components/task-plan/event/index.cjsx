React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'

PlanFooter = require '../footer'
PlanMixin = require '../plan-mixin'
TaskPlanBuilder = require '../builder'

EventPlan = React.createClass
  displayName: 'EventPlan'
  mixins: [PlanMixin]
  render: ->
    {id, courseId} = @props
    builderProps = _.pick(@state, 'isVisibleToStudents', 'isEditable', 'isSwitchable')

    plan = TaskPlanStore.get(id)

    formClasses = ['edit-event', 'dialog']

    footer = <PlanFooter
      id={id}
      courseId={courseId}
      onPublish={@publish}
      onSave={@save}
      onCancel={@cancel}
      isVisibleToStudents={@state.isVisibleToStudents}
      getBackToCalendarParams={@getBackToCalendarParams}
      goBackToCalendar={@goBackToCalendar}/>

    header = @builderHeader('event', '')
    if @state?.invalid then formClasses.push('is-invalid-form')

    <div className='event-plan task-plan' data-assignment-type='event'>
      <BS.Panel bsStyle='primary'
        className={formClasses.join(' ')}
        footer={footer}
        header={header}>

        <BS.Grid fluid>
          <TaskPlanBuilder courseId={courseId} id={id} label='Event' {...builderProps}/>
        </BS.Grid>
      </BS.Panel>
    </div>

module.exports = {EventPlan}
