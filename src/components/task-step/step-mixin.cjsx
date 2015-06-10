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
    {taskId, review, pinned} = @props
    showFooter = true
    showFooter = @showFooter() if @showFooter?

    if showFooter
      task = TaskStore.get(taskId)
      footer = @renderFooterButtons?() or @renderContinueButton()

      taskInfo = [
          <Details task={task} key="task-#{taskId}-details"/>
          <div className='task-title'>{task.title}</div>
        ] unless review?.length

      footer = <div>
        {footer}
        {taskInfo}
      </div>

    {pinned} = @props
    <CardBody className='task-step' footer={footer} pinned={pinned}>
      {@renderBody()}
      {@renderGroup?()}
    </CardBody>
