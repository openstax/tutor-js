React = require 'react/addons'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'

CrumbMixin = require '../crumb-mixin'
{ChapterSectionMixin, ArbitraryHtmlAndMath} = require 'openstax-react-components'
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


    if crumb.data.title?
      previewText = crumb.data.title
      if crumb.type is 'end'
        previewText = "#{previewText} Completed"

      preview = <div className='milestone-preview'>
        <p>
          {previewText}
        </p>
      </div>

    if crumb.data.type is 'coach'
      preview = <div className='milestone-preview'>
        <p>Concept Coach</p>
      </div>

    preview = <div className='milestone-preview'>
      <p>
        {crumb.data.related_content[0].title}
      </p>
    </div> if crumb.data.related_content?[0]?.title?

    if crumb.data.content?.questions?
      question = _.first(crumb.data.content.questions)
      preview = <ArbitraryHtmlAndMath
        block={true}
        className='milestone-preview'
        html={question.stem_html}/>

    console.info(crumb) if crumb.data.related_content?[0]?.title? or crumb.type is 'end'

    <BS.Col xs=3 lg=2 className='milestone-wrapper'>
      <div
        tabIndex='0'
        className={classes}
        onClick={_.partial(goToStep, crumb.key)}>
        {@props.children}
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

    @toggleCheckingClick()

  componentWillUnmount: ->
    TaskStepStore.setMaxListeners(10)
    TaskStore.off('task.beforeRecovery', @stopUpdate)
    TaskStore.off('task.afterRecovery', @update)
    @stopListeningForProgress()

    @toggleCheckingClick(false)

  componentWillReceiveProps: (nextProps) ->
    if @props.id isnt nextProps.id
      @stopListeningForProgress()
      @startListeningForProgress(nextProps)
    crumbs = @getCrumableCrumbs()
    @setState({crumbs})

  toggleCheckingClick: (toggleOn = true) ->
    eventAction = if toggleOn then 'addEventListener' else 'removeEventListener'

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
    @props.closeMilestones() unless @props.goToStep(args...)

  render: ->
    {crumbs, currentStep} = @state

    stepButtons = _.map crumbs, (crumb, crumbIndex) =>
      <Milestone
        key={"crumb-wrapper-#{crumbIndex}"}
        crumb={crumb}
        goToStep={@goToStep}
        currentStep={currentStep}>
        <BreadcrumbTaskDynamic
          crumb={crumb}
          data-label={crumb.label}
          currentStep={currentStep}
          goToStep={@goToStep}
          key="breadcrumb-#{crumb.type}-#{crumb.key}"
          ref="breadcrumb-#{crumb.type}-#{crumb.key}"/>
      </Milestone>

    classes = 'task-breadcrumbs'

    <div className='milestones-wrapper' role='dialog' tabIndex='-1'>
      <div className='milestones task-breadcrumbs' role='document'>
        {stepButtons}
      </div>
    </div>


Milestones = React.createClass
  displayName: 'Milestones'
  # propTypes:
  #   taskId: React.PropTypes.string.isRequired
  #   focus: React.PropTypes.bool.isRequired
  render: ->

    milestones = <MilestonesWrapper {...@props} key='milestones'/> if @props.showMilestones

    <ReactCSSTransitionGroup
      transitionName='task-with-milestones'
      transitionAppearTimeout={0}
      transitionAppear={true}>
      {milestones}
    </ReactCSSTransitionGroup>

module.exports = {MilestonesWrapper, Milestone, Milestones}
