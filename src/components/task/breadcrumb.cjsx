React = require 'react'
{StepPanel} = require '../../helpers/policies'

module.exports = React.createClass
  displayName: 'Breadcrumb'

  propTypes:
    crumb: React.PropTypes.object.isRequired
    currentStep: React.PropTypes.number.isRequired
    goToStep: React.PropTypes.func.isRequired

  render: ->
    {crumb, currentStep, goToStep} = @props
    step = crumb.data
    canReview = StepPanel.canReview(step.id) if crumb.type is 'step'
    crumbType = step.type

    bsStyle = null
    classes = ['step', 'icon-stack', 'icon-lg']
    title = null

    if crumb.key is currentStep
      classes.push('current')
      classes.push('active')
      title = "Current Step (#{step.type})"

    if step.is_completed
      classes.push('completed')
      bsStyle = 'primary'
      title ?= "Step Completed (#{step.type}). Click to review"

      if canReview
        if step.is_correct
          status = <i className='icon-lg icon-correct'></i>
        else if step.answer_id
          status = <i className='icon-lg icon-incorrect'></i>

    if crumb.type is 'end'
      title = "#{step.title} Completion"
      crumbType = crumb.type

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

