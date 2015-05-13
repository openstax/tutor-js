React = require 'react'
BS = require 'react-bootstrap'

{TaskActions} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
LoadableItem = require '../loadable-item'
{CardBody} = require '../pinned-header-footer-card/sections'


module.exports =

  renderGenericFooter: ->
    buttonClasses = '-continue'
    buttonClasses += ' disabled' unless @isContinueEnabled()
    continueButton = <BS.Button
      bsStyle='primary'
      className={buttonClasses}
      onClick={@onContinue}>Continue</BS.Button>

    {continueButton}

  render: ->
    footer = @renderFooterButtons?() or @renderGenericFooter()
    {pinned} = @props

    <CardBody className='task-step' footer={footer} pinned={pinned}>
      {@renderBody()}
      {@renderGroup?()}
    </CardBody>
