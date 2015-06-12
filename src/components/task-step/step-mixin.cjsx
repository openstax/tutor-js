React = require 'react'
BS = require 'react-bootstrap'

{CardBody} = require '../pinned-header-footer-card/sections'
Details = require '../task/details'
AsyncButton = require '../async-button'
{TaskStore} = require '../../flux/task'
{TaskStepStore} = require '../../flux/task-step'

module.exports =

  renderContinueButton: ->
    isWaiting = TaskStepStore.isLoading(@props.id)
    isSaving = TaskStepStore.isSaving(@props.id)
    isFailed = TaskStepStore.isFailed(@props.id)

    waitingText = 'Saving…' if isSaving

    <AsyncButton
      bsStyle='primary'
      className='-continue'
      onClick={@onContinue}
      disabled={not @isContinueEnabled()}
      isWaiting={isWaiting or isSaving}
      isFailed={isFailed}
      waitingText={waitingText}
      >
      {@continueButtonText?() or 'Continue'}
    </AsyncButton>

  render: ->
    {taskId, review} = @props

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
