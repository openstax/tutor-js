React = require 'react'
BS = require 'react-bootstrap'
Time = require '../time'
Markdown = require '../markdown'

module.exports = React.createClass
  propTypes:
    task: React.PropTypes.object.isRequired

    title: React.PropTypes.string
    dateFormat: React.PropTypes.string
    dateLabel: React.PropTypes.string
    trigger: React.PropTypes.string
    placement: React.PropTypes.string
    className: React.PropTypes.string

  getDefaultProps: ->
    title: 'Instructions'
    dateFormat: 'ddd MMM Do'
    dateLabel: 'Due'
    trigger: 'focus'
    placement: 'top'

  render: ->
    {task, title, dateFormat, dateLabel, trigger, placement, className} = @props

    className += ' task-details'

    if not task.due_at?
      return null

    if task.description
      detailPopover =
        <BS.Popover className='task-details-popover'>
          <Markdown text={task.description} />
        </BS.Popover>
      details =
        <div className={className}>
          <div>
            {dateLabel} <Time date={task.due_at} format={dateFormat}></Time>
            <BS.OverlayTrigger trigger={trigger} placement={placement} overlay={detailPopover}>
              <button className='task-details-info'/>
            </BS.OverlayTrigger>
          </div>
          {@props.children}
        </div>
    else
      details =
        <div className={className}>
          <div>
            {dateLabel} <Time date={task.due_at} format={dateFormat}></Time>
          </div>
          {@props.children}
        </div>

    details
