React = require 'react'
BS = require 'react-bootstrap'

{TaskStepStore} = require '../../flux/task-step'

module.exports =

  componentWillMount: -> TaskStepStore.addChangeListener(@update)
  componentWillUnmount: -> TaskStepStore.removeChangeListener(@update)

  update: -> @setState({})

  render: ->
    isDisabledClass = 'disabled' unless @isContinueEnabled()

    footer = <BS.Button bsStyle="primary" className={isDisabledClass} onClick={@onContinue}>Continue</BS.Button>

    <BS.Panel bsStyle="default" className="task-step" footer={footer}>
      {@renderBody()}
    </BS.Panel>
