React = require 'react'
BS = require 'react-bootstrap'
Time = require '../time'
Markdown = require '../markdown'

module.exports = React.createClass
  render: ->
    {task} = @props

    if task.description_html
      detailPopover =
        <BS.Popover title='Instructions' className='-task-details-popover task-details-popover'>
          <Markdown>{task.description_html}</Markdown>
        </BS.Popover>
      details =
        <BS.OverlayTrigger trigger='focus' placement='left' overlay={detailPopover}>
          <BS.Button bsStyle="default" className='-task-details task-details'>
            <i className='fa fa-info-circle'></i> Due <Time date={task.due_at} format='l'></Time>
          </BS.Button>
        </BS.OverlayTrigger>
    else
      details =
        <span className='-task-details task-details'>Due <Time date={task.due_at} format='l'></Time></span>
