React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

Breadcrumb = React.createClass
  displayName: 'Breadcrumb'
  propTypes:
    crumb: React.PropTypes.object.isRequired
    goToStep: React.PropTypes.func.isRequired
    step: React.PropTypes.object.isRequired
    canReview: React.PropTypes.boolean
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

  getState: ({crumb, currentStep, step, canReview}) ->
    isCorrect = false
    isIncorrect = false
    isCurrent = crumb.key is currentStep
    isCompleted = step?.is_completed
    isEnd = crumb.type is 'end'
    crumbType = if isEnd then crumb.type else step?.type

    if isCompleted
      if canReview and step.correct_answer_id?
        if step.is_correct
          isCorrect = true
        else if step.answer_id
          isIncorrect = true

    {isCorrect, isIncorrect, isCurrent, isCompleted, isEnd, crumbType}

  render: ->
    {step, crumb, goToStep, className} = @props
    {isCorrect, isIncorrect, isCurrent, isCompleted, isEnd, crumbType} = @state

    propsToPassOn = _.pick(@props, 'onMouseEnter', 'onMouseLeave', 'style')

    if isCurrent
      title = "Current Step (#{crumbType})"

    if isCompleted
      title ?= "Step Completed (#{crumbType}). Click to review"

    if isCorrect
      status = <i className='icon-lg icon-correct'></i>

    if isIncorrect
      status = <i className='icon-lg icon-incorrect'></i>

    if isEnd
      title = "#{step.title} Completion"

    classes = classnames 'task-breadcrumbs-step', 'icon-stack', 'icon-lg', step.group, crumbType, className,
      current: isCurrent
      active: isCurrent
      completed: isCompleted
      'status-correct': isCorrect
      'status-incorrect': isIncorrect

    # build list of icon classes from the crumb type and the step labels
    crumbClasses = _.map(crumb.data.labels, (label) -> "icon-#{label}") if crumb.data.labels?
    iconClasses = classnames "icon-#{crumbType}", crumbClasses

    <span
      {...propsToPassOn}
      className={classes}
      title={title}
      onClick={_.partial(goToStep, crumb.key)}
      data-chapter={crumb.sectionLabel}
      key="step-#{crumb.key}">
      <i className="icon-lg #{iconClasses}"></i>
      {status}
    </span>

module.exports = Breadcrumb
