React = require 'react'
BS = require 'react-bootstrap'

CrumbMixin = require './crumb-mixin'
Breadcrumbs = require './breadcrumbs'
{ReviewShell} = require './review'
{StatsModalShell} = require '../plan-stats'
{PinnedHeaderFooterCard, ChapterSectionMixin, ScrollToMixin} = require 'shared'

_ = require 'underscore'
Router = require '../../helpers/router'
{TaskPlanStatsStore} = require '../../flux/task-plan-stats'
{TaskTeacherReviewStore} = require '../../flux/task-teacher-review'
ScrollSpy = require '../scroll-spy'


TaskTeacherReview = React.createClass
  propTypes:
    id: React.PropTypes.string

  displayName: 'TaskTeacherReview'

  mixins: [ChapterSectionMixin, CrumbMixin, ScrollToMixin]

  scrollingTargetDOM: -> window.document

  contextTypes:
    router: React.PropTypes.object

  setStepKey: ->
    {sectionIndex} = Router.currentParams()
    defaultKey = null
    # url is 1 based so it matches the breadcrumb button numbers
    crumbKey = if sectionIndex then parseInt(sectionIndex) - 1 else defaultKey
    @setState(currentStep: crumbKey)

  setScrollState: (scrollState) ->
    @setState({scrollState})

  getInitialState: ->
    {id} = @props
    {periodId} = Router.currentParams()

    currentStep: null
    scrollState: {}
    period: {id: periodId}
    isReviewLoaded: TaskTeacherReviewStore.get(id)?
    steps: []
    crumbs: []

  componentWillMount: ->
    @setStepKey()
    TaskTeacherReviewStore.on('review.loaded', @setIsReviewLoaded)

  componentWillUnmount: ->
    TaskTeacherReviewStore.off('review.loaded', @setIsReviewLoaded)

  componentWillReceiveProps: (nextProps) ->
    if nextProps.shouldUpdate
      key = _.first(nextProps.onScreenElements)
      if key? and parseInt(key) isnt @state.currentStep
        @goToStep(parseInt(key))

  syncRoute: ({path}) ->
    {params} = @context.router.match(path)
    @syncStep(params)

  syncStep: (params) ->
    {sectionIndex} = params
    currentStep = sectionIndex - 1
    @setState({currentStep})

  scrollToStep: (currentStep) ->
    stepSelector = "[data-section='#{currentStep}']"
    @scrollToSelector(stepSelector, {updateHistory: false, unlessInView: false, scrollTopOffset: 180})

  shouldComponentUpdate: (nextProps) ->
    {shouldUpdate} = nextProps
    shouldUpdate ?= true

    shouldUpdate

  goToStep: (stepKey) ->
    params = Router.currentParams()
    # url is 1 based so it matches the breadcrumb button numbers
    params.sectionIndex = stepKey + 1
    params.id = @props.id # if we were rendered directly, the router might not have the id

  setPeriod: (period) ->
    return unless @state.isReviewLoaded

    params = Router.currentParams()
    contentState = @getReviewContents(period)
    contentState.period = period

    @setState(contentState)

  setIsReviewLoaded: (id) ->
    return null unless id is @props.id

    TaskTeacherReviewStore.off('review.loaded', @setIsReviewLoaded)

    params = Router.currentParams()
    @syncStep(params)

    contentState = @getReviewContents()
    contentState.isReviewLoaded = true

    @setState(contentState)

  getReviewContents: (period) ->
    steps = @getContents(period)
    crumbs = @generateCrumbs(period)

    {steps, crumbs}

  getActiveStep: ->
    {steps, currentStep} = @state
    activeStep = _.find(steps, {key: currentStep})

  render: ->
    {id, courseId} = @props
    {steps, crumbs, period} = @state

    panel = <ReviewShell
          id={id}
          review='teacher'
          panel='teacher-review'
          goToStep={@goToStep}
          steps={steps}
          currentStep={@state.currentStep}
          period={period} />

    taskClasses = 'task-teacher-review'

    if @state.isReviewLoaded
      task = TaskTeacherReviewStore.get(id)
      taskClasses = "task-teacher-review task-#{task.type}"

      breadcrumbs = <Breadcrumbs
        id={id}
        crumbs={crumbs}
        goToStep={@goToStep}
        scrollToStep={@scrollToStep}
        currentStep={@state.currentStep}
        title={task.title}
        courseId={courseId}
        key="task-#{id}-breadcrumbs" />

    <PinnedHeaderFooterCard
      className={taskClasses}
      fixedOffset={0}
      header={breadcrumbs}
      cardType='task'>
        <BS.Grid fluid>
          <BS.Row>
            <BS.Col sm={8}>
              {panel}
            </BS.Col>
            <BS.Col sm={4}>
              <StatsModalShell
                id={id}
                courseId={courseId}
                initialActivePeriodInfo={period}
                shouldOverflowData={true}
                activeSection={@getActiveStep()?.sectionLabel}
                handlePeriodSelect={@setPeriod}/>
            </BS.Col>
          </BS.Row>
        </BS.Grid>
    </PinnedHeaderFooterCard>


TaskTeacherReviewShell = React.createClass

  render: ->
    {id, courseId} = Router.currentParams()
    <ScrollSpy dataSelector='data-section'>
      <TaskTeacherReview key={id} id={id} courseId={courseId}/>
    </ScrollSpy>

module.exports = {TaskTeacherReview, TaskTeacherReviewShell}
