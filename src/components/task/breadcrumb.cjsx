React = require 'react'
{StepPanel} = require '../../helpers/policies'

{TaskStepActions, TaskStepStore} = require '../../flux/task-step'

module.exports = React.createClass
  displayName: 'Breadcrumb'

  componentWillMount: ->
    {crumb} = @props

    if crumb.type is 'step' and TaskStepStore.isPlaceholder(crumb.data.id)
      TaskStepStore.on('step.loaded', @update)

  componentWillUnmount: ->
    TaskStepStore.off('step.loaded', @update)

  update: (id) ->
    {crumb} = @props

    if (crumb.data.id is id) and not TaskStepStore.isPlaceholder(crumb.data.id)
      @setState({})
      TaskStepStore.off('step.loaded', @update)

  propTypes:
    crumb: React.PropTypes.object.isRequired
    currentStep: React.PropTypes.number.isRequired
    goToStep: React.PropTypes.func.isRequired

  render: ->
    {crumb, currentStep, goToStep} = @props
    step = crumb.data
    if crumb.type is 'step'
      # get the freshest version of the step
      step = TaskStepStore.get(crumb.data.id)

    canReview = StepPanel.canReview(step.id) if crumb.type is 'step' and step?
    crumbType = step?.type

    bsStyle = null
    classes = ['step', 'icon-stack', 'icon-lg']
    title = null

    if crumb.key is currentStep
      classes.push('current')
      classes.push('active')
      title = "Current Step (#{crumbType})"

    if step?.is_completed
      classes.push('completed')
      bsStyle = 'primary'
      title ?= "Step Completed (#{crumbType}). Click to review"

      if canReview
        if step.is_correct
          status = <i className='icon-lg icon-correct'></i>
        else if step.answer_id
          status = <i className='icon-lg icon-incorrect'></i>

    if crumb.type is 'end'
      title = "#{step.title} Completion"
      crumbType = crumb.type

    classes.push(step.group) if step?.group?
    classes.push crumbType
    classes = classes.join ' '

    <span
      className={classes}
      title={title}
      onClick={goToStep(crumb.key)}
      key="step-#{crumb.key}">
      <i className="icon-lg icon-#{crumbType}"></i>
      {status}
    </span>

