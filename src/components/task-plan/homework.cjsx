React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
{DateTimePicker} = require 'react-widgets'

PlanFooter = require './footer'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'

HomeworkPlan = React.createClass
  setDueAt: (value) ->
    {id} = @props
    TaskPlanActions.updateDueAt(id, value)

  setTitle: ->
    {id} = @props
    value = @refs.title.getDOMNode().value
    TaskPlanActions.updateTitle(id, value)

  setDescription: ->
    {id} = @props
    desc = @refs.title.getDOMNode().value
    TaskPlanActions.updateDescription(id, desc)
    
  render: ->
    {id, courseId} = @props
    plan = TaskPlanStore.get(id)
    description = TaskPlanStore.getDescription(id)
    headerText = if TaskPlanStore.isNew(id) then 'Add Homework' else 'Edit Homework'

    # Restrict the due date to be after the open date
    # and restrict the open date to be before the due date
    if plan?.opens_at
      opensAt = new Date(plan.opens_at)
    if plan?.due_at
      dueAt = new Date(plan.due_at)

    footer= <PlanFooter id={id} courseId={courseId} />

    <BS.Panel bsStyle="default" className="create-homework" footer={footer}>
      <h1>{headerText}</h1>
      <BS.Grid>
        <BS.Row>
          <BS.Col xs={12} md={6}>
            <div className="-homework-title">
              <label htmlFor="homework-title">Title</label>
              <input
                ref="title"
                id="homework-title"
                type="text"
                value={plan.title}
                placeholder="Enter Title"
                onChange={@setTitle} />
            </div>
            <div className="-homework-due-date">
              <label htmlFor="homework-due-date">Due Date</label>
              <DateTimePicker
                id="homework-due-date"
                format="MMM dd, yyyy"
                time={false}
                calendar={true}
                readOnly={false}
                onChange={@setDueAt}
                min={opensAt}
                value={dueAt}/>
            </div>
          </BS.Col>
          <BS.Col xs={12} md={6}>
            <div className="-homework-description">
              <label htmlFor="homework-description">Description</label>
              <textarea ref="description" id="homework-description" onChange={@setDescription}>
                {description}
              </textarea>
            </div>
          </BS.Col>
        </BS.Row>
      </BS.Grid>
    </BS.Panel>

module.exports = {HomeworkPlan}
