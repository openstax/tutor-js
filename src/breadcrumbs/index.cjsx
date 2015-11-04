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
    console.info("goToStep #{stepIndex}")
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


  render: ->
    {task} = @state
    {currentStep} = @props

    crumbs = _.map(task.steps, (crumbStep, index) ->
      crumb =
        key: index
        data: crumbStep
        crumb: true
        type: 'step'
    )

    crumbs.push(type: 'end', key: crumbs.length, data: {id: ''})

    breadcrumbs = _.map(crumbs, (crumb) =>
      <BreadcrumbDynamic
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
