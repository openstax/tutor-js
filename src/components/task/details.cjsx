React = require 'react'
BS = require 'react-bootstrap'
Time = require '../time'
Markdown = require '../markdown'
_ = require 'underscore'

Instructions = React.createClass
  displayName: 'Instructions'
  propTypes:
    task: React.PropTypes.object.isRequired

    title: React.PropTypes.string
    trigger: React.PropTypes.string
    placement: React.PropTypes.string
    popverClassName: React.PropTypes.string

  getDefaultProps: ->
    title: 'Instructions'
    trigger: 'hover'
    placement: 'top'
    popverClassName: 'task-details-popover'

  render: ->
    {task, title, trigger, placement, popverClassName, children} = @props

    return null unless task.description?

    instructionsPopover =
      <BS.Popover className={popverClassName} title={title}>
        <Markdown text={task.description} />
      </BS.Popover>

    defaultTriggerButton = <button className='task-details-instructions'/>

    <BS.OverlayTrigger trigger={trigger} placement={placement} overlay={instructionsPopover}>
      {children or defaultTriggerButton}
    </BS.OverlayTrigger>


Details = React.createClass
  displayName: 'Details'
  propTypes:
    task: React.PropTypes.object.isRequired

    title: React.PropTypes.string
    dateFormat: React.PropTypes.string
    dateLabel: React.PropTypes.string
    trigger: React.PropTypes.string
    placement: React.PropTypes.string
    className: React.PropTypes.string
    lateStatus: React.PropTypes.element

  getDefaultProps: ->
    dateFormat: 'ddd MMM Do'
    dateLabel: 'Due'

  render: ->
    {task, dateFormat, dateLabel, lateStatus, className} = @props

    className ?= ''
    className += ' task-details'

    return null unless task.due_at?

    if task.description
      instructionsProps = _.pick(@props, 'task', 'title', 'trigger', 'placement')
      details =
        <div className={className}>
          <div>
            {dateLabel} <Time date={task.due_at} format={dateFormat}></Time>
            {lateStatus}
            <Instructions {...instructionsProps}/>
          </div>
        </div>
    else
      details =
        <div className={className}>
          <div className='task-details-due-date'>
            {dateLabel} <Time date={task.due_at} format={dateFormat}></Time>
            {lateStatus}
          </div>
        </div>

    details

module.exports = {Details, Instructions}
