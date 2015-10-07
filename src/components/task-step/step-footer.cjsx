React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{StepPanel} = require '../../helpers/policies'

{CardBody} = require '../pinned-header-footer-card/sections'
AsyncButton = require '../buttons/async-button'
{TaskStore} = require '../../flux/task'
StepFooterMixin = require './step-footer-mixin'

{TaskStepStore} = require '../../flux/task-step'

StepFooter = React.createClass
  displayName: 'StepFooter'
  mixins: [StepFooterMixin]

  renderContinueButton: ->
    return null if @props.hideContinue

    # if this is the last step completed and the view is read-only,
    # then you cannot continue, and this will override @isContinueEnabled
    waitingText = switch
      when TaskStepStore.isLoading(@props.id) then "Loading…"
      when TaskStepStore.isSaving(@props.id)  then "Saving…"
      else null

    cannotContinue = not StepPanel.canContinue(@props.id) or not @props.isContinueEnabled

    <AsyncButton
      bsStyle='primary'
      className='continue'
      key='step-continue'
      onClick={@onContinue}
      disabled={cannotContinue}
      isWaiting={!!waitingText}
      waitingText={waitingText}
      isFailed={TaskStepStore.isFailed(@props.id)}
      >
      {@props.continueText or 'Continue'}
    </AsyncButton>

  render: ->
    {pinned, courseId, id, taskId, review} = @props

    <div>
      {@renderFooter({stepId: id, taskId, courseId, review})}
    </div>

module.exports = StepFooter
