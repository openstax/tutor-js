React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router-dom'
validator = require 'validator'
classnames = require 'classnames'

{TutorInput, TutorDateInput, TutorTextArea} = require '../../tutor-input'
{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
{TaskingStore} = require '../../../flux/tasking'

{default: PlanFooter} = require '../footer'
PlanMixin = require '../plan-mixin'
TaskPlanBuilder = require '../builder'

ExternalPlan = React.createClass
  displayName: 'ExternalPlan'
  mixins: [PlanMixin]

  setUrl: (url) ->
    {id} = @props
    TaskPlanActions.updateUrl(id, url)

  validate: (inputValue) ->
    return ['required'] unless (inputValue? and inputValue.length > 0)
    return ['url'] unless validator.isURL(inputValue)

  render: ->
    {id, courseId} = @props
    builderProps = _.pick(@state, 'isVisibleToStudents', 'isEditable', 'isSwitchable')
    hasError = @hasError()

    plan = TaskPlanStore.get(id)
    externalUrl = plan?.settings?.external_url

    formClasses = ['edit-external', 'dialog']

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

    header = @builderHeader('external')
    label = 'Assignment URL'

    isURLLocked = TaskingStore.isTaskOpened(id) and TaskPlanStore.isPublished(id)
    label = "#{label} (Cannot be changed once assignment is opened and published)" if isURLLocked

    formClasses = classnames('edit-external', 'dialog', {
      'is-invalid-form': hasError
    })

    <div className='external-plan task-plan' data-assignment-type='external'>
      <BS.Panel
        className={formClasses}
        footer={footer}
        header={header}>

        <BS.Grid fluid>
          <TaskPlanBuilder courseId={courseId} id={id} {...builderProps}/>

          <BS.Row>
            <BS.Col xs={12} md={12}>
              <TutorInput
                disabled={isURLLocked}
                label={label}
                className='external-url'
                id='external-url'
                default={externalUrl}
                required={true}
                validate={@validate}
                onChange={@setUrl} />
            </BS.Col>
          </BS.Row>

        </BS.Grid>
      </BS.Panel>
    </div>

module.exports = {ExternalPlan}
