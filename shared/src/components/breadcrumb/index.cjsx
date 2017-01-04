React = require 'react'

map = require 'lodash/map'
omit    = require 'lodash/omit'
partial = require 'lodash/partial'

classnames = require 'classnames'
{propHelpers} = require 'shared'

Breadcrumb = React.createClass
  displayName: 'Breadcrumb'
  propTypes:
    crumb: React.PropTypes.object.isRequired
    stepIndex: React.PropTypes.number.isRequired
    goToStep: React.PropTypes.func.isRequired
    step: React.PropTypes.object.isRequired
    canReview: React.PropTypes.bool
    currentStep: React.PropTypes.number
    onMouseEnter: React.PropTypes.func
    onMouseLeave: React.PropTypes.func

  getDefaultProps: ->
    canReview: true
    step: {}

  getInitialState: ->
    @getState(@props)

  componentWillReceiveProps: (nextProps) ->
    nextState = @getState(nextProps)
    @setState(nextState)

  getState: ({crumb, stepIndex, currentStep, step, canReview}) ->
    isCorrect = false
    isIncorrect = false
    isCurrent = stepIndex is currentStep
    isCompleted = step?.is_completed
    isEnd = crumb.type is 'end'

    {type} = crumb
    crumbType = type

    if isCompleted
      if canReview and step.correct_answer_id?
        if step.is_correct
          isCorrect = true
        else if step.answer_id
          isIncorrect = true

    {isCorrect, isIncorrect, isCurrent, isCompleted, isEnd, crumbType}

  render: ->
    {step, crumb, goToStep, className, stepIndex} = @props
    {isCorrect, isIncorrect, isCurrent, isCompleted, isEnd, crumbType} = @state

    propsToPassOn = omit(@props,
      'onClick', 'title', 'className', 'data-chapter', 'key', 'step',
      'goToStep', 'canReview', 'currentStep', 'stepIndex', 'crumb'
    )

    if isCurrent
      title = "Current Step (#{crumbType})"

    if isCompleted
      title ?= "Step Completed (#{crumbType}). Click to review"

    if isCorrect
      status = <i className='icon-lg icon-correct'></i>

    if isIncorrect
      status = <i className='icon-lg icon-incorrect'></i>

    if isEnd
      title = "#{step.task?.title} Completion"

    classes = classnames 'openstax-breadcrumbs-step', 'icon-stack', 'icon-lg', step.group, "breadcrumb-#{crumbType}", className,
      current: isCurrent
      active: isCurrent
      completed: isCompleted
      'status-correct': isCorrect
      'status-incorrect': isIncorrect

    # build list of icon classes from the crumb type and the step labels
    crumbClasses = map(crumb.labels, (label) -> "icon-#{label}") if crumb.labels?
    iconClasses = classnames "icon-#{crumbType}", crumbClasses

    <span
      {...propsToPassOn}
      className={classes}
      title={title}
      onClick={partial(goToStep, stepIndex)}
      data-chapter={crumb.sectionLabel}
      key="step-#{crumb.key}">
      <i className="icon-lg #{iconClasses}"></i>
      {status}
    </span>

module.exports = Breadcrumb
