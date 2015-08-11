_ = require 'underscore'

React = require 'react'
Router = require 'react-router'
camelCase = require 'camelcase'
BS = require 'react-bootstrap'

CoursePlanDetails = require './plan-details'
CoursePlanPublishingDetails = require './plan-publishing-details'
CoursePlanLabel = require './plan-label'
{CoursePlanDisplayEdit, CoursePlanDisplayQuickLook, CoursePlanDisplayPublishing} = require './plan-display'

{PlanPublishStore, PlanPublishActions} = require '../../flux/plan-publish'

# TODO drag and drop, and resize behavior
CoursePlan = React.createClass
  displayName: 'CoursePlan'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    item: React.PropTypes.object.isRequired
    activeHeight: React.PropTypes.number.isRequired

  getDefaultProps: ->
    # CALENDAR_EVENT_LABEL_ACTIVE_STATIC_HEIGHT
    activeHeight: 35

  getInitialState: ->
    isViewingStats: false
    publishStatus: ''
    isPublishing: false
    isHovered: false

  # utility functions for functions called in lifecycle methods
  _doesPlanMatchesRoute: ->
    {planId} = @context.router.getCurrentParams()
    planId is @props.item.plan.id

  _isPlanNotMatchingRouteOpen: ->
    not (@_doesPlanMatchesRoute() or @state.isViewingStats) and @refs.display0.details?

  _isPlanMatchRouteNotOpen: ->
    console.info('_doesPlanMatchesRoute')
    console.info((@_doesPlanMatchesRoute() or @state.isViewingStats))
    {planId} = @context.router.getCurrentParams()
    (@_doesPlanMatchesRoute() or @state.isViewingStats) and not @refs.display0.details?

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
  syncStatsWithState: ->
    if @_isPlanMatchRouteNotOpen()
      if @refs.display0.refs.trigger?
        console.info('hello')
        # triggerEl = @refs.display0.refs.trigger.getDOMNode()
        # triggerEl.click()
      else
        @setIsViewingStats(false)
    else if @_isPlanNotMatchingRouteOpen()
      @refs.display0.refs.trigger?.hide()

  # handles when plan is clicked directly and viewing state and route both need to update
  setIsViewingStats: (isViewingStats) ->
    @_updateRoute(isViewingStats)
    @setState({isViewingStats})
    # @syncStatsWithState()

  checkPublishingStatus: (published) ->
    if published.publishFor is @props.item.plan.id
      planStatus =
        publishStatus: published.status
        isPublishing: (['working', 'queued'].indexOf(published.status) > -1)

      @setState(planStatus)
      PlanPublishStore.off('planPublish.*', @checkPublishingStatus) if published.status is 'completed'

  subscribeToPublishing: (item) ->
    {plan} = item
    {id, isPublishing, publish_job_uuid} = plan

    if isPublishing and not PlanPublishStore.isPublishing(id)
      PlanPublishActions.published({id, publish_job_uuid}) if publish_job_uuid?

    PlanPublishStore.on('planPublish.*', @checkPublishingStatus) if isPublishing or PlanPublishStore.isPublishing(id)

  componentWillMount: ->
    @subscribeToPublishing(@props.item)

  componentWillReceiveProps: (nextProps) ->
    @subscribeToPublishing(nextProps.item)

  componentWillUnmount: ->
    PlanPublishStore.off('planPublish.*', @checkPublishingStatus)

  componentDidMount: ->
    @syncStatsWithState()

  componentDidUpdate: (prevProps, prevState) ->
    @syncStatsWithState() if prevState.isViewingStats isnt @state.isViewingStats

  syncOpenPlan: ->
    @setIsViewingStats(true) unless @state.isViewingStats

  syncClosePlan: ->
    @setIsViewingStats(false) if @state.isViewingStats

  syncHover: ->
    @setState(isHovered: true) unless @state.isHovered

  removeHover: ->
    @setState(isHovered: false) if @state.isHovered

  render: ->
    {item, courseId} = @props
    {publishStatus, isPublishing, isHovered, isViewingStats} = @state
    {plan, displays} = item
    {durationLength} = plan

    planDisplays = _.map(displays, (display) =>
      {rangeDuration, offset, index, weekTopOffset, order} = display

      # Adjust width based on plan duration and left position based on offset of plan from start of week
      # CALENDAR_EVENT_DYNAMIC_WIDTH and CALENDAR_EVENT_DYNAMIC_POSITION
      # top is calculated by using:
      #   weekTopOffset -- the distance from the top of the calendar for plans in the same week
      #   order -- the order the plan should be from the bottom, is an int more than 1 when a plan needs to
      #       stack on top of other plans that overlap in duration.
      planStyle =
        width: durationLength * 100 / 7 + '%'
        left: offset * 100 / 7 + '%'
        top: (weekTopOffset + 4 - order * 3) + 'rem'

      labelProps = {rangeDuration, plan, index, offset}
      label = <CoursePlanLabel {...labelProps} ref='label'/>

      displayComponent = CoursePlanDisplayEdit
      displayComponent = CoursePlanDisplayQuickLook if plan.isPublished or (publishStatus is 'completed')
      displayComponent = CoursePlanDisplayPublishing if isPublishing

      displayComponentProps = {
        plan,
        display,
        label,
        courseId,
        publishStatus,
        isPublishing,
        isActive: isHovered or isViewingStats,
        syncHover: @syncHover,
        removeHover: @removeHover,
        syncOpenPlan: @syncOpenPlan
        syncClosePlan: @syncClosePlan
      }

      <displayComponent {...displayComponentProps} ref="display#{index}"/>
    )

    <div>
      {planDisplays}
    </div>


module.exports = CoursePlan
