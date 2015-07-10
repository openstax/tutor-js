React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'

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

  render: ->
    {id, courseId} = @props
    plan = TaskPlanStore.get(id)

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
                label='Assignment URL'
                className='external-url'
                value={plan.url}
                id='external-url'
                default={plan.url}
                required={true}
                onChange={@setUrl} />
            </BS.Col>
          </BS.Row>
        </BS.Grid>
      </BS.Panel>
    </div>

module.exports = {ExternalPlan}
