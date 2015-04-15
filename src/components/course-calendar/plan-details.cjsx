React = require 'react'
BS = require 'react-bootstrap'

PlanDetails = React.createClass
  displayName: 'PlanDetails'
  propTypes:
    task: React.PropTypes.object

  render: ->
    {task} = @props

    <div>
      <BS.Popover title={task.title} placement='right'  positionLeft={200} positionTop={50} className='task-details-popover'>
        <p>Hello</p>
      </BS.Popover>
    </div>

module.exports = PlanDetails
