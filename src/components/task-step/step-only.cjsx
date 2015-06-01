React = require 'react'
{ Route, DefaultRoute, RouteHandler, Link } = require('react-router')
BS = require 'react-bootstrap'
_ = require 'underscore'
camelCase = require 'camelcase'

{ScrollListenerMixin} = require 'react-scroll-components'

{TaskActions, TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'

TaskStep = require './index'
{Spacer} = require './all-steps'
Ends = require './ends'

module.exports = React.createClass
  propTypes:
    id: React.PropTypes.string

  displayName: 'TaskStepChild'

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    {stepIndex} = @context.router.getCurrentParams()
    # url is 1 based so it matches the breadcrumb button numbers
    crumbKey = if stepIndex then parseInt(stepIndex) - 1 else @getDefaultCurrentStep()
    {
      currentStep: crumbKey
    }

  renderStep: (data) ->
    <TaskStep
      id={data.id}
      taskId={@props.taskId}
      goToStep={@props.goToStep}
      onNextStep={@props.onNextStep}
      refreshStep={@props.refreshStep}
      recoverFor={@props.recoverFor}
    />

  renderEnd: (data) ->
    {courseId} = @context.router.getCurrentParams()
    type = if data.type then data.type else 'task'
    End = Ends.get(type)

    panel = <End courseId={courseId} taskId={@props.taskId} reloadPractice={@props.reloadTask}/>

  renderSpacer: (data) ->
    <Spacer onNextStep={@props.onNextStep} taskId={@props.taskId}/>

  # add render methods for different panel types as needed here
  render: ->
    # get the crumb that matches the current state
    {crumb} = @props
    # crumb.type is one of ['intro', 'step', 'end']
    renderPanelMethod = camelCase "render-#{crumb.type}"

    throw new Error("BUG: panel #{crumb.type} does not have a render method") unless @[renderPanelMethod]?
    panel = @[renderPanelMethod]?(crumb.data)

