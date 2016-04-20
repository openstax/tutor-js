React = require 'react'
BS = require 'react-bootstrap'

Breadcrumbs = require './breadcrumbs'
{ReviewShell} = require './review'
{StatsModalShell} = require '../plan-stats'
{PinnedHeaderFooterCard} = require 'openstax-react-components'

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
    {sectionIndex} = @context.router.getCurrentParams()
    defaultKey = null
    # url is 1 based so it matches the breadcrumb button numbers
    crumbKey = if sectionIndex then parseInt(sectionIndex) - 1 else defaultKey
    @setState(currentStep: crumbKey)

  getPeriodIndex: ->
    {periodIndex} = @context.router.getCurrentParams()
    periodIndex ?= 1

    parseInt(periodIndex) - 1

  setScrollState: (scrollState) ->
    @setState({scrollState})

  getInitialState: ->
    {id} = @props

    currentStep: null
    scrollState: {}
    period: {}
    isReviewLoaded: TaskTeacherReviewStore.get(id)?

  componentWillMount: ->
    @setStepKey()
    TaskTeacherReviewStore.on('review.loaded', @setIsReviewLoaded)

  componentWillReceiveProps: ->
    @setStepKey()

  goToStep: (stepKey) ->
    params = _.clone(@context.router.getCurrentParams())
    # url is 1 based so it matches the breadcrumb button numbers
    params.sectionIndex = stepKey + 1
    params.id = @props.id # if we were rendered directly, the router might not have the id

    params.periodIndex ?= 1

    @context.router.replaceWith('reviewTaskStep', params)

  setPeriod: (period) ->
    @setState({period})

  setPeriodIndex: (key) ->
    periodKey = key + 1
    params = _.clone(@context.router.getCurrentParams())
    params.periodIndex = periodKey

    if params.sectionIndex
      @context.router.replaceWith('reviewTaskStep', params)
    else
      @context.router.replaceWith('reviewTaskPeriod', params)

  setIsReviewLoaded: (id) ->
    return null unless id is @props.id

    TaskTeacherReviewStore.off('change', @setIsReviewLoaded)
    @setState({isReviewLoaded: true})

  render: ->
    {id, courseId} = @props
    periodIndex = @getPeriodIndex()

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
        title={task.title}
        courseId={courseId}
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
                initialActivePeriod={periodIndex}
                shouldOverflowData={true}
                activeSection={@state.scrollState?.sectionLabel}
                handlePeriodSelect={@setPeriod}
                handlePeriodKeyUpdate={@setPeriodIndex}/>
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
