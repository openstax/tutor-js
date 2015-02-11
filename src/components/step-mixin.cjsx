React = require 'react'

module.exports =
  render: ->
    isDisabledClass = 'disabled' unless @isContinueEnabled()

    <div className="task-step panel panel-default">
      <div className="panel-body">
        {@renderBody()}
      </div>
      <div className="panel-footer">
        <button className="btn btn-primary #{isDisabledClass}" onClick={@onContinue}>Continue</button>
      </div>
    </div>
