React = require 'react'
BS = require 'react-bootstrap'

{TaskActions} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
LoadableItem = require '../loadable-item'

module.exports =

  renderGenericFooter: ->
    isDisabledClass = 'disabled' unless @isContinueEnabled()
    continueButton = <BS.Button bsStyle="primary" className={isDisabledClass} onClick={@onContinue}>Continue</BS.Button>
    <span>
      {continueButton}
    </span>

  render: ->
    footer = @renderFooterButtons?() or @renderGenericFooter()

    <BS.Panel bsStyle="default" className="task-step" footer={footer}>
      {@renderBody()}
    </BS.Panel>
