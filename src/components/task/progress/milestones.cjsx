React = require 'react/addons'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'

CrumbMixin = require '../crumb-mixin'
{ChapterSectionMixin, ArbitraryHtmlAndMath} = require 'openstax-react-components'
{BreadcrumbStatic} = require '../../breadcrumb'

{TaskStepActions, TaskStepStore} = require '../../../flux/task-step'
{TaskProgressActions, TaskProgressStore} = require '../../../flux/task-progress'
{TaskStore} = require '../../../flux/task'
{StepTitleStore} = require '../../../flux/step-title'

ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

Milestone = React.createClass
  displayName: 'Milestone'
  propTypes:
    goToStep: React.PropTypes.func.isRequired
    crumb: React.PropTypes.object.isRequired
    currentStep: React.PropTypes.number.isRequired

  handleKeyUp: (crumbKey, keyEvent) ->
    if keyEvent.keyCode is 13 or keyEvent.keyCode is 32
      @props.goToStep(crumbKey)
      keyEvent.preventDefault()

  render: ->
    {goToStep, crumb, currentStep} = @props

    isCurrent = crumb.key is currentStep

    classes = classnames 'milestone',
      'active': isCurrent

    {title} = crumb.data
    title ?= StepTitleStore.get(crumb.data.id)

    if title?
      previewText = title
      if crumb.type is 'end'
        previewText = "#{previewText} Completed"

    if crumb.data.type is 'coach'
      previewText = 'Concept Coach'

    if crumb.data.type is 'exercise'
      preview = <ArbitraryHtmlAndMath
        block={true}
        className='milestone-preview'
        html={previewText}/>
    else
      preview = <div className='milestone-preview'>{previewText}</div>

    <BS.Col xs=3 lg=2 className='milestone-wrapper'>
      <div
        tabIndex='0'
        className={classes}
        role='button'
        aria-label={previewText}
        onClick={_.partial(goToStep, crumb.key)}
        onKeyUp={_.partial(@handleKeyUp, crumb.key)}>
        <BreadcrumbStatic
          crumb={crumb}
          data-label={crumb.label}
          currentStep={currentStep}
          goToStep={@goToStep}
          key="breadcrumb-#{crumb.type}-#{crumb.key}"
          ref="breadcrumb-#{crumb.type}-#{crumb.key}"/>
        {preview}
      </div>
    </BS.Col>

MilestonesWrapper = React.createClass
  displayName: 'MilestonesWrapper'

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

    @switchCheckingClick()

  componentDidMount: ->
    @switchTransitionListen()

  componentWillUnmount: ->
    TaskStepStore.setMaxListeners(10)
    TaskStore.off('task.beforeRecovery', @stopUpdate)
    TaskStore.off('task.afterRecovery', @update)
    @stopListeningForProgress()

    @switchCheckingClick(false)
    @switchTransitionListen(false)

  componentWillReceiveProps: (nextProps) ->
    if @props.id isnt nextProps.id
      @stopListeningForProgress()
      @startListeningForProgress(nextProps)
    crumbs = @getCrumableCrumbs()
    @setState({crumbs})

  componentDidEnter: (transitionEvent) ->
    @props.handleTransitions?(transitionEvent) if transitionEvent.propertyName is 'transform'

  switchTransitionListen: (switchOn = true) ->
    eventAction = if switchOn then 'addEventListener' else 'removeEventListener'

    milestones = @getDOMNode()
    milestones[eventAction]('transitionend', @componentDidEnter)
    milestones[eventAction]('webkitTransitionEnd', @componentDidEnter)

  switchCheckingClick: (switchOn = true) ->
    eventAction = if switchOn then 'addEventListener' else 'removeEventListener'

    document[eventAction]('click', @checkAllowed, true)
    document[eventAction]('focus', @checkAllowed, true)

  checkAllowed: (focusEvent) ->
    modal = @getDOMNode()

    unless modal.contains(focusEvent.target) or @props.filterClick?(focusEvent)
      focusEvent.preventDefault()
      focusEvent.stopImmediatePropagation()
      modal.focus()

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

  goToStep: (args...) ->
    if @props.goToStep(args...)
      window.scrollTo(0, 0)
    else
      @props.closeMilestones()

  render: ->
    {crumbs, currentStep} = @state

    stepButtons = _.map crumbs, (crumb, crumbIndex) =>
      <Milestone
        key={"crumb-wrapper-#{crumbIndex}"}
        crumb={crumb}
        goToStep={@goToStep}
        currentStep={currentStep}/>

    classes = 'task-breadcrumbs'

    <div className='milestones-wrapper' role='dialog' tabIndex='-1'>
      <div className='milestones task-breadcrumbs' role='document'>
        {stepButtons}
      </div>
    </div>


Milestones = React.createClass
  displayName: 'Milestones'
  propTypes:
    showMilestones: React.PropTypes.bool.isRequired

  render: ->

    milestones = <MilestonesWrapper
      {...@props}
      ref='milestones'/> if @props.showMilestones

    <ReactCSSTransitionGroup
      transitionName='task-with-milestones'
      transitionAppearTimeout={0}
      transitionAppear={true}>
      {milestones}
    </ReactCSSTransitionGroup>

module.exports = {MilestonesWrapper, Milestone, Milestones}
