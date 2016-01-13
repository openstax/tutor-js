React = require 'react'
classnames = require 'classnames'
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

  makeCrumbEnd: (type, enabled) ->
    {moduleInfo} = @state

    reviewEnd =
      type: 'end'
      data:
        id: "#{type}"
        title: moduleInfo.title
      label: type
      disabled: not enabled

  render: ->
    {task, moduleInfo} = @state
    {currentStep, canReview, shouldContinue} = @props
    return null if _.isEmpty(task.steps)

    crumbs = _.map task.steps, (crumbStep, index) ->
      data: crumbStep
      crumb: true
      type: 'step'

    reviewEnd = @makeCrumbEnd('summary', canReview)
    bookEnd = @makeCrumbEnd('continue', shouldContinue)

    crumbs.push(reviewEnd)
    crumbs.push(bookEnd)

    breadcrumbs = _.map crumbs, (crumb, index) =>
      {disabled} = crumb
      classes = classnames({disabled})
      crumb.key = index

      <BreadcrumbDynamic
        className={classes}
        data-type={crumb.label}
        key={crumb.data.id}
        crumb={crumb}
        step={crumb.data or {}}
        currentStep={currentStep}
        goToStep={@props.goToStep}/>


    <div className='task-homework'>
      <div className='task-breadcrumbs'>
        {breadcrumbs}
      </div>
    </div>

module.exports = {Breadcrumbs}
