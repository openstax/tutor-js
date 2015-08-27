_ = require 'underscore'

React = require 'react'
Router = require 'react-router'
camelCase = require 'camelcase'
BS = require 'react-bootstrap'

CoursePlanDetails = require './plan-details'
CoursePlanPublishingDetails = require './plan-publishing-details'
CoursePlanLabel = require './plan-label'
{CoursePlanDisplayEdit, CoursePlanDisplayQuickLook} = require './plan-display'

{PlanPublishStore, PlanPublishActions} = require '../../flux/plan-publish'
PlanHelper = require '../../helpers/plan'


# TODO drag and drop, and resize behavior
CoursePlan = React.createClass
  displayName: 'CoursePlan'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired
    item: React.PropTypes.shape(
      plan: React.PropTypes.object
      displays: React.PropTypes.array
    )
    activeHeight: React.PropTypes.number

  getDefaultProps: ->
    # CALENDAR_EVENT_LABEL_ACTIVE_STATIC_HEIGHT
    activeHeight: 35

  getInitialState: ->
    isViewingStats: @_doesPlanMatchesRoute()
    publishStatus: PlanPublishStore.getAsyncStatus(@props.item.plan.id)
    isPublishing: PlanPublishStore.isPublishing(@props.item.plan.id)
    isHovered: false

  # utility functions for functions called in lifecycle methods
  _doesPlanMatchesRoute: ->
    {planId} = @context.router.getCurrentParams()
    planId is @props.item.plan.id

  _getExpectedRoute: (isViewingStats) ->
    closedRouteName = 'calendarByDate'
    openedRouteName = 'calendarViewPlanStats'

    if isViewingStats then openedRouteName else closedRouteName

  _getExpectedParams: (isViewingStats) ->
    planId = @props.item.plan.id

    params = @context.router.getCurrentParams()
    closedParams = _.omit(params, 'planId')
    openedParams = _.extend({}, params, {planId})

    if isViewingStats then openedParams else closedParams

  _updateRoute: (isViewingStats) ->
    expectedRoute = @_getExpectedRoute(isViewingStats)
    expectedParams = @_getExpectedParams(isViewingStats)
    currentParams = @context.router.getCurrentParams()
    @context.router.transitionTo(expectedRoute, expectedParams) unless _.isEqual(currentParams, expectedParams)

  # handles when route changes and modal show/hide needs to sync
  # i.e. when using back or forward on browser
  checkRoute: ->
    isViewingStats = @_doesPlanMatchesRoute()
    @setState({isViewingStats})

  # handles when plan is clicked directly and viewing state and route both need to update
  syncIsViewingStats: (isViewingStats) ->
    @_updateRoute(isViewingStats)
    @setState({isViewingStats})

  checkPublishingStatus: (published) ->
    planId = @props.item.plan.id
    if published.for is planId
      planStatus =
        publishStatus: published.status
        isPublishing: PlanPublishStore.isPublishing(planId)

      @setState(planStatus)
      PlanPublishStore.removeAllListeners("progress.#{planId}.*", @checkPublishingStatus) if PlanPublishStore.isDone(planId)

  subscribeToPublishing: (plan) ->
    publishState = PlanHelper.subscribeToPublishing(plan, @checkPublishingStatus)
    @setState(publishState)

  componentWillMount: ->
    @subscribeToPublishing(@props.item.plan)
    location = @context.router.getLocation()
    location.addChangeListener(@checkRoute)

  componentWillReceiveProps: (nextProps) ->
    if @props.item.plan.id isnt nextProps.item.plan.id
      @subscribeToPublishing(nextProps.item.plan)
      @stopCheckingPlan(@props.item.plan)
    else if nextProps.item.plan.isPublishing and not @props.item.plan.isPublishing
      @subscribeToPublishing(nextProps.item.plan)

  componentWillUnmount: ->
    @stopCheckingPlan(@props.item.plan)
    location = @context.router.getLocation()
    location.removeChangeListener(@checkRoute)

  stopCheckingPlan: (plan) ->
    PlanPublishActions.stopChecking(plan.id) if @state.isPublishing
    PlanPublishStore.removeAllListeners("progress.#{plan.id}.*")

  setIsViewing: (isViewingStats) ->
    @syncIsViewingStats(isViewingStats) if @state.isViewingStats isnt isViewingStats

  setHover: (isHovered) ->
    @setState({isHovered}) if @state.isHovered isnt isHovered

  buildPlanClasses: (plan, publishStatus, isPublishing, isActive) ->
    planClasses = [
      'plan-label-long'
      "#{plan.type}"
      "course-plan-#{plan.id}"
    ]

    planClasses.push('is-published') if plan.isPublished or (publishStatus is 'completed')
    planClasses.push('is-failed') if publishStatus is 'failed'
    planClasses.push('is-killed') if publishStatus is 'killed'
    planClasses.push('is-publishing') if isPublishing
    planClasses.push('is-open') if plan.isOpen
    planClasses.push('is-trouble') if plan.isTrouble
    planClasses.push('active') if isActive

    planClasses.join(' ')


  renderDisplay: (hasQuickLook, planClasses, display) ->
    {rangeDuration, offset, offsetFromPlanStart, index} = display
    {item, courseId} = @props
    {plan, displays} = item

    labelProps = {rangeDuration, plan, index, offset, offsetFromPlanStart}
    label = <CoursePlanLabel {...labelProps} ref="label#{index}"/>

    displayComponent = CoursePlanDisplayEdit
    displayComponent = CoursePlanDisplayQuickLook if hasQuickLook

    displayComponentProps = {
      plan,
      display,
      label,
      courseId,
      planClasses,
      isFirst: (index is 0),
      isLast: (index is displays.length - 1),
      setHover: @setHover,
      setIsViewing: @setIsViewing
    }

    <displayComponent
      {...displayComponentProps}
      ref="display#{index}"
      key="display#{index}"/>

  render: ->
    {item, courseId} = @props
    {publishStatus, isPublishing, isHovered, isViewingStats} = @state
    {plan, displays} = item
    {durationLength} = plan

    planClasses = @buildPlanClasses(plan, publishStatus, isPublishing, isHovered or isViewingStats)

    if isViewingStats
      if plan.isPublished or (publishStatus is 'completed')
        planModal = <CoursePlanDetails
          plan={plan}
          courseId={courseId}
          className={planClasses}
          onRequestHide={@syncIsViewingStats.bind(null, false)}
          ref='details'/>
      else if isPublishing
        planModal = <CoursePlanPublishingDetails
          plan={plan}
          courseId={courseId}
          className={planClasses}
          onRequestHide={@syncIsViewingStats.bind(null, false)}
          ref='details'/>

    planClasses = "plan #{planClasses}"
    renderDisplay = _.partial(@renderDisplay, (plan.isPublished or (publishStatus is 'completed') or isPublishing), planClasses)
    planDisplays = _.map(displays, renderDisplay)

    <div>
      {planDisplays}
      {planModal}
    </div>


module.exports = CoursePlan
