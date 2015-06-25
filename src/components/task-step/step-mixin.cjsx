React = require 'react'
BS = require 'react-bootstrap'

{CardBody} = require '../pinned-header-footer-card/sections'
AsyncButton = require '../buttons/async-button'

{TaskStepStore} = require '../../flux/task-step'

module.exports =

  renderContinueButton: ->
    isWaiting = TaskStepStore.isLoading(@props.id)
    isSaving = TaskStepStore.isSaving(@props.id)
    isFailed = TaskStepStore.isFailed(@props.id)

    <AsyncButton
      bsStyle='primary'
      className='-continue'
      onClick={@onContinue}
      disabled={not @isContinueEnabled()}
      isWaiting={isWaiting}
      isFailed={isFailed}
      >
      {@continueButtonText?() or 'Continue'}
    </AsyncButton>

  render: ->
    {pinned, courseId, id, taskId, review} = @props

    # from StepFooterMixin
    footer = @renderFooter({stepId: id, taskId, courseId, review})

    <CardBody className='task-step' footer={footer} pinned={pinned}>
      {@renderBody()}
      {@renderGroup?()}
    </CardBody>
