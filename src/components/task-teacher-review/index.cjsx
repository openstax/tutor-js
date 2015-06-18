React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

Breadcrumbs = require './breadcrumbs'
{ReviewShell} = require './review'
{StatsModalShell} = require '../task-plan/reading-stats'
PinnedHeaderFooterCard = require '../pinned-header-footer-card'

_ = require 'underscore'
camelCase = require 'camelcase'

{TaskTeacherReviewStore} = require '../../flux/task-teacher-review'


TaskTeacherReview = React.createClass
  propTypes:
    id: React.PropTypes.string

  displayName: 'TaskTeacherReview'

  contextTypes:
    router: React.PropTypes.func

  setStepKey: ->
    {stepIndex} = @context.router.getCurrentParams()
    defaultKey = 0
    # url is 1 based so it matches the breadcrumb button numbers
    crumbKey = if stepIndex then parseInt(stepIndex) - 1 else defaultKey
    @setState(currentStep: crumbKey)

  setScrollState: (scrollState) ->
    @setState({scrollState})

  getInitialState: ->
    currentStep: 0
    scrollState: {}
    period: {}
    isReviewLoaded: false

  componentWillMount: ->
    @setStepKey()
    TaskTeacherReviewStore.on('review.loaded', @setIsReviewLoaded)

  componentWillReceiveProps: ->
    @setStepKey()

  # Curried for React
  goToStep: (stepKey) ->
    =>
      params = @context.router.getCurrentParams()
      # url is 1 based so it matches the breadcrumb button numbers
      params.stepIndex = stepKey + 1
      params.id = @props.id # if we were rendered directly, the router might not have the id

      @context.router.replaceWith('reviewTaskStep', params)

  setPeriod: (period) ->
    @setState({period})

  setIsReviewLoaded: (id) ->
    return null unless id is @props.id

    TaskTeacherReviewStore.off('change', @setIsReviewLoaded)
    @setState({isReviewLoaded: true})

  render: ->
    {id, courseId} = @props

    panel = <ReviewShell
          id={id}
          review='teacher'
          panel='teacher-review'
          goToStep={@goToStep}
          setScrollState={@setScrollState}
          currentStep={@state.currentStep}
          period={@state.period} />

    taskClasses = 'task-teacher-review'

    if @state.isReviewLoaded
      task = TaskTeacherReviewStore.get(id)
      taskClasses = "task-teacher-review task-#{task.type}"

      breadcrumbs = <Breadcrumbs
        id={id}
        goToStep={@goToStep}
        currentStep={@state.currentStep}
        key="task-#{id}-breadcrumbs"/>

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
                activeSection={@state.scrollState?.sectionLabel}
                handlePeriodSelect={@setPeriod}/>
            </BS.Col>
          </BS.Row>
        </BS.Grid>
    </PinnedHeaderFooterCard>


TaskTeacherReviewShell = React.createClass
  contextTypes:
    router: React.PropTypes.func
  render: ->
    {id, courseId} = @context.router.getCurrentParams()
    <TaskTeacherReview key={id} id={id} courseId={courseId}/>

module.exports = {TaskTeacherReview, TaskTeacherReviewShell}
