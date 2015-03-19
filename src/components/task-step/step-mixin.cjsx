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

  renderLoaded: ->
    isDisabledClass = 'disabled' unless @isContinueEnabled()

    footer = <BS.Button bsStyle="primary" className={isDisabledClass} onClick={@onContinue}>Continue</BS.Button>

    <BS.Panel bsStyle="default" className="task-step" footer={footer}>
      {@renderBody()}
    </BS.Panel>
