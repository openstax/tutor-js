React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'

LateWork = React.createClass
  displayName: 'LateWork'

  render: ->
    {task, recalcAverages, rowIndex, columnIndex} = @props
    popover =
      <BS.Popover
        id="late-work-info-popover-#{task.id}"
        className='late-work-info-popover'>
          <BS.Button onClick={recalcAverages}>
            late work
          </BS.Button>

      </BS.Popover>



    <div className="late-caret-trigger">
      <BS.OverlayTrigger
      placement="top"
      trigger="click"
      rootClose={true}
      overlay={popover}>
        <div className="late-caret"></div>
      </BS.OverlayTrigger>
    </div>


module.exports = LateWork
