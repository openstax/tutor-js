React = require 'react'
{Breadcrumb} = require 'openstax-react-components'
_ = require 'underscore'

tasks = require '../task/collection'
exercises = require '../exercise/collection'


BreadcrumbDynamic = React.createClass
  displayName: 'BreadcrumbDynamic'

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
    crumbProps = _.omit(@props, 'step')

    <Breadcrumb
      {...crumbProps}
      step={step}
      canReview={true}
      goToStep={@goToStep}/>



Breadcrumbs = React.createClass
  displayName: 'Breadcrumbs'
  getInitialState: ->
    {collectionUUID, moduleUUID} = @props
    taskId = "#{collectionUUID}/#{moduleUUID}"

    task: tasks.get(taskId)
    moduleInfo: tasks.getModuleInfo(taskId)

  render: ->
    {task, moduleInfo} = @state
    {currentStep, canReview} = @props

    return null if _.isEmpty(task.steps)

    crumbs = _.map(task.steps, (crumbStep, index) ->
      crumb =
        key: index
        data: crumbStep
        crumb: true
        type: 'step'
    )

    reviewEnd =
      type: 'end'
      key: crumbs.length
      data:
        id: ''
        title: moduleInfo.title
      disabled: not canReview

    crumbs.push(reviewEnd)

    breadcrumbs = _.map(crumbs, (crumb) =>
      <BreadcrumbDynamic
        className={'disabled' if crumb.disabled}
        key={crumb.data.id}
        crumb={crumb}
        step={crumb.data or {}}
        currentStep={currentStep}
        goToStep={@props.goToStep}/>
    )

    <div className='task-homework'>
      <div className='task-breadcrumbs'>
        {breadcrumbs}
      </div>
    </div>

module.exports = {Breadcrumbs}
