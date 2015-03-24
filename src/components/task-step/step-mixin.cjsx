React = require 'react'
BS = require 'react-bootstrap'

{TaskActions} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
LoadableMixin = require '../loadable-mixin'

module.exports =

  mixins: [LoadableMixin]

  getId: -> @props.id
  getFlux: ->
    store: TaskStepStore
    actions: TaskStepActions

  renderGenericFooter: ->
    isDisabledClass = 'disabled' unless @isContinueEnabled()
    continueButton = <BS.Button bsStyle="primary" className={isDisabledClass} onClick={@onContinue}>Continue</BS.Button>
    <span>
      {continueButton}
    </span>

  renderLoaded: ->
    if @renderFooterButtons
      footer = @renderFooterButtons()
    else
      footer = @renderGenericFooter()

    <BS.Panel bsStyle="default" className="task-step" footer={footer}>
      {@renderBody()}
    </BS.Panel>
