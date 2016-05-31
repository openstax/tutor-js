React = require 'react/addons'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'

CrumbMixin = require '../crumb-mixin'
{ChapterSectionMixin} = require 'openstax-react-components'
{BreadcrumbTaskDynamic} = require '../../breadcrumb'

{TaskStepActions, TaskStepStore} = require '../../../flux/task-step'
{TaskProgressActions, TaskProgressStore} = require '../../../flux/task-progress'
{TaskStore} = require '../../../flux/task'

ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

Milestone = React.createClass
  displayName: 'Milestone'
  render: ->
    {goToStep, crumb, currentStep} = @props

    isCurrent = crumb.key is currentStep

    classes = classnames 'milestone',
      'active': isCurrent

    <BS.Col xs=3 lg=2 className='milestone-wrapper'>
      <div className={classes} onClick={_.partial(goToStep, crumb.key)}>
        {@props.children}
      </div>
    </BS.Col>

Milestones = React.createClass
  displayName: 'Milestones'

  mixins: [ChapterSectionMixin, CrumbMixin]

  propTypes:
    id: React.PropTypes.string.isRequired
    goToStep: React.PropTypes.func.isRequired

  getInitialState: ->
    currentStep = TaskProgressStore.get(@props.id)

    updateOnNext: true
    currentStep: currentStep

  componentWillMount: ->
    listeners = @getMaxListeners()
    # TaskStepStore listeners include:
    #   One per step for the crumb status updates
    #   Two additional listeners for step loading and completion
    #     if there are placeholder steps.
    #   One for step being viewed in the panel itself
    #     this is the + 1 to the max listeners being returned
    #
    # Only update max listeners if it is greater than the default of 10
    TaskStepStore.setMaxListeners(listeners + 1) if listeners? and (listeners + 1) > 10

    # if a recovery step needs to be loaded, don't update breadcrumbs
    TaskStore.on('task.beforeRecovery', @stopUpdate)
    # until the recovery step has been loaded
    TaskStore.on('task.afterRecovery', @update)

    @startListeningForProgress()
    crumbs = @getCrumableCrumbs()
    @setState {crumbs}

  componentWillUnmount: ->
    TaskStepStore.setMaxListeners(10)
    TaskStore.off('task.beforeRecovery', @stopUpdate)
    TaskStore.off('task.afterRecovery', @update)
    @stopListeningForProgress()

  componentWillReceiveProps: (nextProps) ->
    if @props.id isnt nextProps.id
      @stopListeningForProgress()
      @startListeningForProgress(nextProps)
    crumbs = @getCrumableCrumbs()
    @setState({crumbs})

  stopListeningForProgress: (props) ->
    props ?= @props
    {id} = props

    TaskProgressStore.off("update.#{id}", @setCurrentStep)

  startListeningForProgress: (props) ->
    props ?= @props
    {id} = props

    TaskProgressStore.on("update.#{id}", @setCurrentStep)

  shouldComponentUpdate: (nextProps, nextState) ->
    nextState.updateOnNext

  update: ->
    @setState(updateOnNext: true)

  setCurrentStep: ({previous, current}) ->
    @setState(currentStep: current)

  stopUpdate: ->
    @setState(updateOnNext: false)

  render: ->
    {crumbs, currentStep} = @state
    {goToStep} = @props

    stepButtons = _.map crumbs, (crumb, crumbIndex) =>
      <Milestone
        key={"crumb-wrapper-#{crumbIndex}"}
        crumb={crumb}
        goToStep={goToStep}
        currentStep={currentStep}>
        <BreadcrumbTaskDynamic
          crumb={crumb}
          data-label={crumb.label}
          currentStep={currentStep}
          goToStep={goToStep}
          key="breadcrumb-#{crumb.type}-#{crumb.key}"
          ref="breadcrumb-#{crumb.type}-#{crumb.key}"/>
      </Milestone>

    classes = 'task-breadcrumbs'

    <div className={classes}>
      {stepButtons}
    </div>


MilestonesWrapper = React.createClass
  displayName: 'MilestonesWrapper'
  # propTypes:
  #   taskId: React.PropTypes.string.isRequired
  #   focus: React.PropTypes.bool.isRequired
  render: ->

    milestones = <div
      className='milestones-wrapper'
      onClick={@props.toggleMilestones}
      key='milestones'>
      <div className='milestones'>
        {@props.children}
      </div>
    </div> if @props.children?

    <ReactCSSTransitionGroup
      transitionName='task-with-milestones'
      transitionEnterTimeout={500}
      transitionAppear={true}
      transitionLeaveTimeout={300}>
      {milestones}
    </ReactCSSTransitionGroup>

module.exports = {MilestonesWrapper, Milestone, Milestones}
