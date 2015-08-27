React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{StepPanel} = require '../../helpers/policies'

{CardBody} = require '../pinned-header-footer-card/sections'
AsyncButton = require '../buttons/async-button'
{TaskStore} = require '../../flux/task'

{TaskStepStore} = require '../../flux/task-step'

module.exports =

  renderContinueButton: ->
    return null if @hideContinueButton?()

    # if this is the last step completed and the view is read-only,
    # then you cannot continue, and this will override @isContinueEnabled
    waitingText = switch
      when TaskStepStore.isLoading(@props.id) then "Loading…"
      when TaskStepStore.isSaving(@props.id)  then "Saving…"
      else null

    cannotContinue = not StepPanel.canContinue(@props.id) or not @isContinueEnabled?()

    <AsyncButton
      bsStyle='primary'
      className='continue'
      onClick={@onContinue}
      disabled={cannotContinue}
      isWaiting={!!waitingText}
      waitingText={waitingText}
      isFailed={TaskStepStore.isFailed(@props.id)}
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
