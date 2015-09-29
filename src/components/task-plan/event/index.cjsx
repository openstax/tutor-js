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
    plan = TaskPlanStore.get(id)
    externalUrl = plan?.settings?.external_url

    formClasses = ['edit-event', 'dialog']

    footer = <PlanFooter
      id={id}
      courseId={courseId}
      onPublish={@publish}
      onSave={@save}
      onCancel={@cancel}
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
          <TaskPlanBuilder courseId={courseId} id={id} label='Event'/>
        </BS.Grid>
      </BS.Panel>
    </div>

module.exports = {EventPlan}
