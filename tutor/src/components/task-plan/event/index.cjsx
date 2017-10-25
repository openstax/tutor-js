React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router-dom'
classnames = require 'classnames'

{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'

{default: PlanFooter} = require '../footer'
PlanMixin = require '../plan-mixin'
TaskPlanBuilder = require '../builder'

EventPlan = React.createClass
  displayName: 'EventPlan'
  mixins: [PlanMixin]
  render: ->
    {id, courseId} = @props
    builderProps = _.pick(@state, 'isVisibleToStudents', 'isEditable', 'isSwitchable')
    hasError = @hasError()

    plan = TaskPlanStore.get(id)

    footer = <PlanFooter
      id={id}
      courseId={courseId}
      onPublish={@publish}
      onSave={@save}
      onCancel={@cancel}
      hasError={hasError}
      isVisibleToStudents={@state.isVisibleToStudents}
      getBackToCalendarParams={@getBackToCalendarParams}
      goBackToCalendar={@goBackToCalendar}/>

    header = @builderHeader('event', '')

    formClasses = classnames 'edit-event', 'dialog',
      'is-invalid-form': hasError

    <div className='event-plan task-plan' data-assignment-type='event'>
      <BS.Panel
        className={formClasses}
        footer={footer}
        header={header}>

        <BS.Grid fluid>
          <TaskPlanBuilder courseId={courseId} id={id} label='Event' {...builderProps}/>
        </BS.Grid>
      </BS.Panel>
    </div>

module.exports = {EventPlan}
