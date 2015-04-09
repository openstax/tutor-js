React = require 'react'
BS = require 'react-bootstrap'
Time = require '../time'
ArbitraryHtml = require '../html'

module.exports = React.createClass
  render: ->
    {model} = @props

    if model.description_html
      detailPopover =
        <BS.Popover title='Instructions' className='-task-details-popover task-details-popover'>
          <ArbitraryHtml html={model.description_html}/>
        </BS.Popover>
      details =
        <BS.OverlayTrigger trigger='focus' placement='left' overlay={detailPopover}>
          <BS.Button bsStyle="default" className='-task-details task-details'>
            <i className='fa fa-info-circle'></i> Due <Time date={model.due_at} format='l'></Time>
          </BS.Button>
        </BS.OverlayTrigger>
    else
      details =
        <span className='-task-details task-details'>Due <Time date={model.due_at} format='l'></Time></span>
