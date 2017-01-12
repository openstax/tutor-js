React = require 'react'
classnames = require 'classnames'
{Breadcrumb, TaskHelper} = require 'shared'
_ = require 'underscore'

tasks = require '../task/collection'
exercises = require '../exercise/collection'


BreadcrumbDynamic = React.createClass
  displayName: 'BreadcrumbDynamic'

  propTypes:
    goToStep: React.PropTypes.func.isRequired
    step: React.PropTypes.object.isRequired

  getInitialState: ->
    step: @props.step

  componentWillMount: ->
    {id} = @props.step
    exercises.channel.on("load.#{id}", @update)

  componentWillUnmount: ->
    {id} = @props.step
    exercises.channel.off("load.#{id}", @update)

  update: (eventData) ->
    @setState(step: eventData.data)

  goToStep: (stepIndex) ->
    @props.goToStep(stepIndex)

  render: ->
    {step} = @state
    {crumb} = @props

    step.title ?= crumb?.task?.title
    crumbProps = _.omit(@props, 'step')

    <Breadcrumb
      {...crumbProps}
      step={step}
      canReview={true}
      goToStep={@goToStep}/>



Breadcrumbs = React.createClass
  displayName: 'Breadcrumbs'

  propTypes:
    goToStep: React.PropTypes.func.isRequired
    moduleUUID: React.PropTypes.string.isRequired
    collectionUUID: React.PropTypes.string.isRequired
    currentStep: React.PropTypes.number
    canReview: React.PropTypes.bool

  render: ->
    {currentStep, canReview, collectionUUID, moduleUUID} = @props
    taskId = "#{collectionUUID}/#{moduleUUID}"

    task = tasks.get(taskId)
    return null if _.isEmpty(task) or _.isEmpty(task.steps)

    moduleInfo = tasks.getModuleInfo(taskId)
    task.title = moduleInfo.title

    crumbs = TaskHelper.mapSteps(task)
    crumbs[crumbs.length - 1].disabled = not canReview

    breadcrumbs = _.map crumbs, (crumb, index) =>
      {disabled} = crumb
      classes = classnames({disabled})

      <BreadcrumbDynamic
        key={index}
        className={classes}
        data-label={crumb.label}
        crumb={crumb}
        stepIndex={index}
        step={crumb or {}}
        currentStep={currentStep}
        goToStep={@props.goToStep}/>


    <div className='task-homework'>
      <div className='task-breadcrumbs'>
        {breadcrumbs}
      </div>
    </div>

module.exports = {Breadcrumbs}
