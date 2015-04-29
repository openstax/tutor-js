React = require 'react'
BS = require 'react-bootstrap'
{TaskStore} = require '../../flux/task'

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
      crumbType = step.type

      bsStyle = null
      classes = ['step']
      title = null

      if crumb.key is @props.currentStep
        classes.push('current')
        classes.push('active')
        title = "Current Step (#{step.type})"

      if step.is_completed
        classes.push('completed')
        bsStyle = 'primary'
        title ?= "Step Completed (#{step.type}). Click to review"

      if crumb.type is 'end'
        title = "#{step.title} Completion"
        crumbType = crumb.type

      classes.push crumbType
      classes = classes.join ' '

      <BS.Button
        bsStyle={bsStyle}
        className={classes}
        title={title}
        onClick={@props.goToStep(crumb.key)}
        key="step-#{crumb.key}">
        <i className="fa fa-fw #{crumbType}"></i>
      </BS.Button>

    <BS.ButtonGroup className='steps'>
      {stepButtons}
    </BS.ButtonGroup>
