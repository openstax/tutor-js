React = require 'react'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'

_ = require 'underscore'

CrumbMixin = require './crumb-mixin'
ChapterSectionMixin = require '../chapter-section-mixin'
Breadcrumb = require './breadcrumb'

module.exports = React.createClass
  displayName: 'Breadcrumbs'

  mixins: [ChapterSectionMixin, CrumbMixin]

  propTypes:
    id: React.PropTypes.string.isRequired
    currentStep: React.PropTypes.number.isRequired
    goToStep: React.PropTypes.func.isRequired

  getInitialState: ->
    updateOnNext:
      true

  componentWillMount: ->
    # if a recovery step needs to be loaded, don't update breadcrumbs
    TaskStore.on('task.beforeRecovery', @stopUpdate)
    # until the recovery step has been loaded
    TaskStore.on('task.afterRecovery', @update)

  componentWillUnmount: ->
    TaskStore.off('task.beforeRecovery', @stopUpdate)
    TaskStore.off('task.afterRecovery', @update)

  shouldComponentUpdate: (nextProps, nextState) ->
    nextState.updateOnNext

  update: ->
    @setState(updateOnNext: true)

  stopUpdate: ->
    @setState(updateOnNext: false)

  render: ->
    crumbs = @getCrumableCrumbs()
    {currentStep, goToStep} = @props

    stepButtons = _.map crumbs, (crumb) ->
      <Breadcrumb
        crumb={crumb}
        currentStep={currentStep}
        goToStep={goToStep}
        key="breadcrumb-#{crumb.type}-#{crumb.key}"/>

    <div className='task-breadcrumbs'>
      {stepButtons}
    </div>
