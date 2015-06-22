React = require 'react'
_ = require 'underscore'

module.exports =
  propTypes:
    crumb: React.PropTypes.object.isRequired
    currentStep: React.PropTypes.number
    goToStep: React.PropTypes.func.isRequired

  getInitialState: ->
    canReview: true
    step: {}

  render: ->
    {crumb, currentStep, goToStep} = @props
    {canReview, step} = @state

    crumbType = step?.type

    bsStyle = null
    classes = ['task-breadcrumbs-step', 'icon-stack', 'icon-lg']
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
          classes.push('status-correct')
        else if step.answer_id
          status = <i className='icon-lg icon-incorrect'></i>
          classes.push('status-incorrect')

    if crumb.type is 'end'
      title = "#{step.title} Completion"
      crumbType = crumb.type

    # build list of icon classes from the crumb type and the step labels
    icons = ['', crumbType]
    icons = _.union(icons, crumb.data.labels) if crumb.data.labels?
    iconClasses = icons.join(' icon-')

    classes.push(step.group) if step?.group?
    classes.push crumbType
    classes = classes.join ' '

    <span
      className={classes}
      title={title}
      onClick={goToStep(crumb.key)}
      data-chapter={crumb.sectionLabel}
      key="step-#{crumb.key}">
      <i className="icon-lg #{iconClasses}"></i>
      {status}
    </span>

