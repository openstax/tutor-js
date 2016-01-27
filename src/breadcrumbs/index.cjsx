React = require 'react'
classnames = require 'classnames'
{Breadcrumb} = require 'openstax-react-components'
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

  getInitialState: ->
    {collectionUUID, moduleUUID} = @props
    taskId = "#{collectionUUID}/#{moduleUUID}"

    task: tasks.get(taskId)
    moduleInfo: tasks.getModuleInfo(taskId)

  makeCrumbEnd: (label, enabled) ->
    {moduleInfo} = @state

    reviewEnd =
      type: 'end'
      data:
        id: "#{label}"
        title: moduleInfo.title
      label: label
      disabled: not enabled

  render: ->
    {task, moduleInfo} = @state
    {currentStep, canReview} = @props
    return null if _.isEmpty(task.steps)

    crumbs = _.map task.steps, (crumbStep, index) ->
      data: crumbStep
      crumb: true
      type: 'step'

    reviewEnd = @makeCrumbEnd('summary', canReview)

    crumbs.push(reviewEnd)

    breadcrumbs = _.map crumbs, (crumb, index) =>
      {disabled} = crumb
      classes = classnames({disabled})
      crumb.key = index

      <BreadcrumbDynamic
        className={classes}
        data-label={crumb.label}
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
