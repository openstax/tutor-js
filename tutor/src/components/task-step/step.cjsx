React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{StepPanel} = require '../../helpers/policies'

{AsyncButton, CardBody} = require 'shared'

StepCard = React.createClass
  displayName: 'StepCard'
  render: ->
    {pinned, courseId, id, taskId, review, children, footer} = @props

    # from StepFooterMixin
    # footer = @renderFooter({stepId: id, taskId, courseId, review})
    <CardBody className='task-step' footer={footer} pinned={pinned}>
      {children}
    </CardBody>

module.exports = StepCard
