React = require 'react'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'

_ = require 'underscore'

CrumbMixin = require './crumb-mixin'
Breadcrumb = require './breadcrumb'

module.exports = React.createClass
  displayName: 'Breadcrumbs'

  mixins: [CrumbMixin]

  propTypes:
    id: React.PropTypes.string.isRequired
    currentStep: React.PropTypes.number.isRequired
    goToStep: React.PropTypes.func.isRequired

  componentWillReceiveProps: ->
    crumbs = @getCrumableCrumbs()
    TaskStepStore.setMaxListeners(3 * crumbs.length) if crumbs?

  componentWillUnmount: ->
    TaskStepStore.setMaxListeners(10)

  render: ->
    crumbs = @getCrumableCrumbs()
    {currentStep, goToStep} = @props

    stepButtons = _.map crumbs, (crumb) ->
      <Breadcrumb
        crumb={crumb}
        currentStep={currentStep}
        goToStep={goToStep}
        key="breadcrumb-#{crumb.type}-#{crumb.key}"/>

    <div className='steps'>
      {stepButtons}
    </div>
