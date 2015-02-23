React = require 'react'
BS = require 'react-bootstrap'

module.exports =
  render: ->
    isDisabledClass = 'disabled' unless @isContinueEnabled()

    footer = <BS.Button bsStyle="primary" className={isDisabledClass} onClick={@onContinue}>Continue</BS.Button>

    <BS.Panel bsStyle="default" className="task-step" footer={footer}>
      {@renderBody()}
    </BS.Panel>
