React = require 'react'
BS = require 'react-bootstrap'

{CardBody} = require '../pinned-header-footer-card/sections'
Details = require '../task/details'
{TaskStore} = require '../../flux/task'

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
    {taskId} = @props

    task = TaskStore.get(taskId)
    footer = @renderFooterButtons?() or @renderGenericFooter()

    footer = <div>
      {footer}
      <Details task={task} key="task-#{taskId}-details"/>
      <div className='task-title'>{task.title}</div>
    </div>

    {pinned} = @props
    <CardBody className='task-step' footer={footer} pinned={pinned}>
      {@renderBody()}
      {@renderGroup?()}
    </CardBody>
