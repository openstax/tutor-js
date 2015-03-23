React = require 'react'
BS = require 'react-bootstrap'

{TaskStepStore} = require '../../flux/task-step'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
LoadableMixin = require '../loadable-mixin'

module.exports =

  mixins: [LoadableMixin]

  getId: -> @props.id
  getFlux: ->
    store: TaskStepStore
    actions: TaskStepActions

  tryAnother: ->
    TaskStepActions.getRecovery(@getId())

  showTryAnother: ->
    step = TaskStepStore.get(@getId())
    return step.has_recovery and step.correct_answer_id isnt step.answer_id

  renderLoaded: ->
    isDisabledClass = 'disabled' unless @isContinueEnabled()

    tryAnotherButton = <BS.Button bsStyle="primary" onClick={@tryAnother}>Try Another</BS.Button> if @showTryAnother()
    continueButton = <BS.Button bsStyle="primary" className={isDisabledClass} onClick={@onContinue}>Continue</BS.Button>

    footer = <span>
      {tryAnotherButton}
      {continueButton}
    </span>

    <BS.Panel bsStyle="default" className="task-step" footer={footer}>
      {@renderBody()}
    </BS.Panel>
