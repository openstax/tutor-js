React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'
camelCase = require 'camelcase'

{TaskTeacherReviewActions, TaskTeacherReviewStore} = require '../../flux/task-teacher-review'

CrumbMixin = require './crumb-mixin'

Breadcrumbs = require './breadcrumbs'
Review = require './review'
{StatsModalShell} = require '../task-plan/reading-stats'

PinnedHeaderFooterCard = require '../pinned-header-footer-card'
LoadableItem = require '../loadable-item'

TaskTeacherReview = React.createClass
  propTypes:
    id: React.PropTypes.string

  displayName: 'TaskTeacherReview'

  mixins: [CrumbMixin]

  contextTypes:
    router: React.PropTypes.func

  setStepKey: ->
    {stepIndex} = @context.router.getCurrentParams()
    # url is 1 based so it matches the breadcrumb button numbers
    defaultKey = @getDefaultCurrentStep()
    crumbKey = if stepIndex then parseInt(stepIndex) - 1 else defaultKey
    crumb = @getCrumb(crumbKey)

    # go ahead and render this step only if this step is accessible
    if crumb?.crumb
      @setState(currentStep: crumbKey)
    # otherwise, redirect to the latest accessible step
    else
      @goToStep(defaultKey)(true)

  getInitialState: ->
    currentStep: 0

  componentWillMount: ->
    @setStepKey()

  componentWillReceiveProps: ->
    @setStepKey()

  # Curried for React
  goToStep: (stepKey) ->
    =>
      params = @context.router.getCurrentParams()
      # url is 1 based so it matches the breadcrumb button numbers
      params.stepIndex = stepKey + 1
      params.id = @props.id # if we were rendered directly, the router might not have the id

      @context.router.transitionTo('reviewTaskStep', params)

  getCrumb: (crumbKey) ->
    crumbs = @generateCrumbs()
    _.findWhere crumbs, {key: crumbKey}

  # add render methods for different panel types as needed here

  render: ->
    {id, courseId} = @props
    task = TaskTeacherReviewStore.get(id)
    return null unless task?

    steps = @getContents()

    panel = <Review
          steps={steps}
          taskId={task.id}
          goToStep={@goToStep}
          onNextStep={@onNextStep}
          review='teacher'
          panel='teacher-review' />

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
              <StatsModalShell id={id}/>
            </BS.Col>
          </BS.Row>
        </BS.Grid>
    </PinnedHeaderFooterCard>

  onNextStep: ->
    @goToStep(@state.currentStep + 1)()


TaskTeacherReviewShell = React.createClass
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {id, courseId} = @context.router.getCurrentParams()
    <LoadableItem
      id={id}
      store={TaskTeacherReviewStore}
      actions={TaskTeacherReviewActions}
      renderItem={-> <TaskTeacherReview key={id} id={id} courseId={courseId}/>}
    />

module.exports = {TaskTeacherReview, TaskTeacherReviewShell}
