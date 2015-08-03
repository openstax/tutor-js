React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'
validator = require 'validator'

{TutorInput, TutorDateInput, TutorTextArea} = require '../../tutor-input'
{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
{TocStore, TocActions} = require '../../../flux/toc'
PlanFooter = require '../footer'
Close = require '../../close'
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
    plan = TaskPlanStore.get(id)
    externalUrl = plan?.settings?.external_url

    headerText = <span key='header-text'>
      {if TaskPlanStore.isNew(id) then 'Add External Assignment' else 'Edit External Assignment'}
    </span>

    formClasses = ['edit-external', 'dialog']
    closeBtn = <Close
      key='close-button'
      className='pull-right'
      onClick={@cancel}/>

    footer = <PlanFooter id={id} courseId={courseId} onPublish={@publish} onSave={@save}/>
    header = [headerText, closeBtn]
    label = 'Assignment URL'
    if @state?.invalid then formClasses.push('is-invalid-form')

    isURLLocked = TaskPlanStore.isOpened(id) and TaskPlanStore.isPublished(id)
    label = "#{label} (Cannot be changed once assignment is opened and published)" if isURLLocked

    <div className='external-plan'>
      <BS.Panel bsStyle='primary'
        className={formClasses.join(' ')}
        footer={footer}
        header={header}>

        <BS.Grid fluid>
          <TaskPlanBuilder courseId={courseId} id={id} />

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
