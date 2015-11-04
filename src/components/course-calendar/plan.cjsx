_ = require 'underscore'
twix = require 'twix'

React = require 'react'
Router = require 'react-router'
camelCase = require 'camelcase'
BS = require 'react-bootstrap'
classnames = require 'classnames'

CoursePlanDetails = require './plan-details'
CoursePlanPublishingDetails = require './plan-publishing-details'
CourseEventDetails = require './plan-event-details'
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
      plan: React.PropTypes.shape(
        id: React.PropTypes.string.isRequired
        title: React.PropTypes.string.isRequired
        type: React.PropTypes.string.isRequired
        durationLength: React.PropTypes.number.isRequired
        opensAt: React.PropTypes.string.isRequired
        isOpen: React.PropTypes.bool
        isPublished: React.PropTypes.bool
        isPublishing: React.PropTypes.bool
        isTrouble: React.PropTypes.bool
        isEditable: React.PropTypes.bool
      ).isRequired
      displays: React.PropTypes.arrayOf(
        React.PropTypes.shape(
          rangeDuration: React.PropTypes.instanceOf(twix).isRequired
          offset: React.PropTypes.number.isRequired
          index: React.PropTypes.number.isRequired
          offsetFromPlanStart: React.PropTypes.number.isRequired
          order: React.PropTypes.number.isRequired
          weekTopOffset: React.PropTypes.number.isRequired
        ).isRequired
      ).isRequired
    )
    activeHeight: React.PropTypes.number

  getDefaultProps: ->
    # CALENDAR_EVENT_LABEL_ACTIVE_STATIC_HEIGHT
    activeHeight: 35

  getInitialState: ->
    {item} = @props
    {plan} = item

    publishStatus = PlanPublishStore.getAsyncStatus(plan.id)

    isViewingStats: @_doesPlanMatchesRoute()
    publishStatus: PlanPublishStore.getAsyncStatus(plan.id)
    isPublishing: PlanPublishStore.isPublishing(plan.id)
    isHovered: false
    isPublished: @_isPublished(plan.isPublished, publishStatus)

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

  _isPublished: (previous, status) ->
    previous or status is 'succeeded'

  checkPublishingStatus: (published) ->
    planId = @props.item.plan.id
    if published.for is planId
      planStatus =
        publishStatus: published.status
        isPublishing: PlanPublishStore.isPublishing(planId)
        isPublished: @_isPublished(@state.isPublished, published.status)

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

  canQuickLook: ->
    {isPublished, isPublishing} = @state

    isPublished or isPublishing

  buildPlanClasses: (plan, publishStatus, isPublishing, isPublished, isActive) ->
    planClasses = classnames 'plan-label-long', "course-plan-#{plan.id}", "is-#{publishStatus}",
      'is-published'  : isPublished
      'is-publishing' : isPublishing
      'is-open'       : plan.isOpen
      'is-trouble'    : plan.isTrouble
      'active'        : isActive

  renderDisplay: (hasQuickLook, planClasses, display) ->
    {rangeDuration, offset, offsetFromPlanStart, index} = display
    {item, courseId} = @props
    {plan, displays} = item

    labelProps = {rangeDuration, plan, index, offset, offsetFromPlanStart}
    label = <CoursePlanLabel {...labelProps} ref="label#{index}"/>

    DisplayComponent = CoursePlanDisplayEdit
    DisplayComponent = CoursePlanDisplayQuickLook if hasQuickLook

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

    <DisplayComponent
      {...displayComponentProps}
      ref="display#{index}"
      key="display#{index}"/>

  render: ->
    {item, courseId} = @props
    {publishStatus, isPublishing, isPublished, isHovered, isViewingStats} = @state
    {plan, displays} = item
    {durationLength} = plan

    planClasses = @buildPlanClasses(plan,
      publishStatus,
      isPublishing,
      isPublished,
      isHovered or isViewingStats
    )

    if isViewingStats
      modalProps =
        plan: plan
        courseId: courseId
        className: planClasses
        onRequestHide: _.partial(@syncIsViewingStats, false)
        ref: 'details'

      if isPublished
        if plan.type is 'event'
          planModal = <CourseEventDetails {...modalProps}/>
        else
          planModal = <CoursePlanDetails {...modalProps}/>
      else if isPublishing
        planModal = <CoursePlanPublishingDetails {...modalProps}/>

    planClasses = "plan #{planClasses}"
    renderDisplay = _.partial(@renderDisplay, @canQuickLook(), planClasses)
    planDisplays = _.map(displays, renderDisplay)

    <div>
      {planDisplays}
      {planModal}
    </div>


module.exports = CoursePlan
