React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{StepPanel} = require '../../helpers/policies'

{CardBody} = require '../pinned-header-footer-card/sections'
AsyncButton = require '../buttons/async-button'
{TaskStore} = require '../../flux/task'
StepFooterMixin = require './step-footer-mixin'

{TaskStepStore} = require '../../flux/task-step'

StepFooter = React.createClass
  displayName: 'StepFooter'
  mixins: [StepFooterMixin]
  getDefaultProps: ->
    controlButtons: null

  renderFooterButtons: ->
    @props.controlButtons

  render: ->
    {pinned, courseId, id, taskId, review} = @props

    <div>
      {@renderFooter({stepId: id, taskId, courseId, review})}
    </div>

module.exports = StepFooter
