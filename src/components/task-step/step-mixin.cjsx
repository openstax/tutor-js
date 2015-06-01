React = require 'react'
BS = require 'react-bootstrap'

{CardBody} = require '../pinned-header-footer-card/sections'
Details = require '../task/details'
{TaskStore} = require '../../flux/task'
{TaskStepStore} = require '../../flux/task-step'

module.exports =

  renderContinueButton: ->
    buttonClasses = '-continue'
    loading = TaskStepStore.isLoading(@props.id) or TaskStepStore.isLoading(@props.id)
    if loading or not @isContinueEnabled()
      buttonClasses += ' disabled'
    text = if loading then 'Loading …' else (@continueButtonText?() or 'Continue')
    continueButton = <BS.Button
      bsStyle='primary'
      className={buttonClasses}
      onClick={@onContinue}>
        {<i className="fa fa-spinner fa-spin"/> if loading}
        {text}
      </BS.Button>

    {continueButton}

  render: ->
    {taskId} = @props

    task = TaskStore.get(taskId)
    footer = @renderFooterButtons?() or @renderContinueButton()

    footer = <div>
      {footer}
      <Details task={task} key="task-#{taskId}-details"/>
      <div className='task-title'>{task.title}</div>
    </div>

    {pinned} = @props
    <CardBody className='task-step' footer={footer} pinned={pinned}>
      {@renderBody()}
      {@renderGroup?()}
    </CardBody>
