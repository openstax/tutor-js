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

# TODO drag and drop, and resize behavior
CoursePlan = React.createClass
  displayName: 'CoursePlan'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    item: React.PropTypes.object.isRequired
    courseId: React.PropTypes.string.isRequired
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
    not (@_doesPlanMatchesRoute()) and @refs.details?

  _isPlanMatchRouteNotOpen: ->
    (@_doesPlanMatchesRoute()) and not @refs.details?

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
    if @_isPlanMatchRouteNotOpen()
      if @refs.display0.refs.trigger?
        @_triggerStats()
      else
        @_updateRoute(false)
    else if @_isPlanNotMatchingRouteOpen()
      @refs.display0.refs.trigger?.hide()

  _triggerStats: ->
    triggerEl = @refs.display0.refs.trigger.getDOMNode()
    triggerEl.click()

  # handles when plan is clicked directly and viewing state and route both need to update
  setIsViewingStats: (isViewingStats) ->
    @_updateRoute(isViewingStats)
    @setState({isViewingStats})

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
    location = @context.router.getLocation()
    location.addChangeListener(@checkRoute)

  componentWillReceiveProps: (nextProps) ->
    @subscribeToPublishing(nextProps.item)

  componentWillUnmount: ->
    PlanPublishStore.off('planPublish.*', @checkPublishingStatus)
    location = @context.router.getLocation()
    location.removeChangeListener(@checkRoute)

  componentDidMount: ->
    @checkRoute()

  syncOpenPlan: ->
    @setIsViewingStats(true) unless @state.isViewingStats

  syncClosePlan: ->
    @setIsViewingStats(false) if @state.isViewingStats

  syncHover: ->
    @setState(isHovered: true) unless @state.isHovered

  removeHover: ->
    @setState(isHovered: false) if @state.isHovered

  buildPlanClasses: (plan, publishStatus, isPublishing, isActive) ->
    planClasses = [
      'plan'
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

  render: ->
    {item, courseId} = @props
    {publishStatus, isPublishing, isHovered, isViewingStats} = @state
    {plan, displays} = item
    {durationLength} = plan

    planClasses = @buildPlanClasses(plan, publishStatus, isPublishing, isHovered or isViewingStats)

    if plan.isPublished or (publishStatus is 'completed')
      planModal = <CoursePlanDetails
        plan={plan}
        courseId={courseId}
        className={planClasses}
        ref='details'/>

    if isPublishing
      planModal = <CoursePlanPublishingDetails
        plan={plan}
        courseId={courseId}
        className={planClasses}
        ref='details'/>

    planDisplays = _.map(displays, (display) =>
      {rangeDuration, offset, index} = display

      labelProps = {rangeDuration, plan, index, offset}
      label = <CoursePlanLabel {...labelProps} ref="label#{index}"/>

      displayComponent = CoursePlanDisplayEdit
      displayComponent = CoursePlanDisplayQuickLook if planModal?

      displayComponentProps = {
        plan,
        display,
        label,
        courseId,
        planModal,
        planClasses,
        syncHover: @syncHover,
        removeHover: @removeHover,
        syncOpenPlan: @syncOpenPlan
        syncClosePlan: @syncClosePlan
      }

      <displayComponent {...displayComponentProps} ref="display#{index}" key="display#{index}"/>
    )

    <div>
      {planDisplays}
    </div>


module.exports = CoursePlan
