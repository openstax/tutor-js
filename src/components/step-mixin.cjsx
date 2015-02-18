React = require 'react'
Breadcrumbs = require './breadcrumbs'

module.exports =
  goToStep: (num) ->
    @props.goToStep && @props.goToStep(num)

  render: ->
    isDisabledClass = 'disabled' unless @isContinueEnabled()

    if @props.task?.steps.length > 1
      breadcrumbs =
        <Breadcrumbs model={@props.task} goToStep={@goToStep} currentStep={@props.model} />

    <div>
      <div className="panel-footer step-footer">
        <button className="btn btn-primary #{isDisabledClass} continue" onClick={@onContinue}>Continue</button>
        {breadcrumbs}
      </div>
      <div className="task-step panel panel-default">
        <div className="panel-body">
          {@renderBody()}
        </div>
        <div className="panel-footer step-footer">
          <button className="btn btn-primary #{isDisabledClass} continue" onClick={@onContinue}>Continue</button>
          {breadcrumbs}
        </div>
      </div>
    </div>
