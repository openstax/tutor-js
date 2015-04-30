React = require 'react'
BS = require 'react-bootstrap'
{TaskStore} = require '../../flux/task'
{StepPanel} = require '../../helpers/policies'

_ = require 'underscore'

CrumbMixin = require './crumb-mixin'

module.exports = React.createClass
  displayName: 'Breadcrumbs'

  mixins: [CrumbMixin]

  propTypes:
    id: React.PropTypes.any.isRequired
    currentStep: React.PropTypes.number.isRequired
    goToStep: React.PropTypes.func.isRequired

  componentWillMount:   -> TaskStore.addChangeListener(@update)
  componentWillUnmount: -> TaskStore.removeChangeListener(@update)

  # TODO: flux-react 2.5 and 2.6 both remove the change listener but still fire @update
  # after a component is unmounted.
  update: -> @setState({})

  render: ->
    crumbs = @getCrumableCrumbs()

    stepButtons = _.map crumbs, (crumb, index) =>
      step = crumb.data
      canReview = StepPanel.canReview(step.id) if crumb.type is 'step'
      crumbType = step.type

      bsStyle = null
      classes = ['step', 'icon-stack', 'icon-lg']
      title = null

      if crumb.key is @props.currentStep
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
        onClick={@props.goToStep(crumb.key)}
        key="step-#{crumb.key}">
        <i className="icon-lg icon-#{crumbType}"></i>
        {status}
      </span>

    <div className='steps'>
      {stepButtons}
    </div>
