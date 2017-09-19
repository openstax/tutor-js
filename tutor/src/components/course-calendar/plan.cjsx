_ = require 'underscore'
twix = require 'twix'

React = require 'react'

BS = require 'react-bootstrap'
classnames = require 'classnames'

{ default: CoursePlanDetails } = require './plan-details'
CoursePlanLabel = require './plan-label'

{ CoursePlanDisplayEdit,
  CoursePlanDisplayQuickLook} = require './plan-display'

{PlanPublishStore, PlanPublishActions} = require '../../flux/plan-publish'
PlanHelper = require '../../helpers/plan'
Router = require '../../helpers/router'


# TODO drag and drop, and resize behavior
CoursePlan = React.createClass
  displayName: 'CoursePlan'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    item: React.PropTypes.shape(
      plan: React.PropTypes.shape(
        id: React.PropTypes.string.isRequired
        title: React.PropTypes.string.isRequired
        type: React.PropTypes.string.isRequired
        durationLength: React.PropTypes.number.isRequired
        opensAt: React.PropTypes.string.isRequired
        isNew: React.PropTypes.bool
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
    onShow: React.PropTypes.func
    onHide: React.PropTypes.func

  contextTypes:
    router: React.PropTypes.object.isRequired
    dateFormatted: React.PropTypes.string.isRequired

  getDefaultProps: ->
    # CALENDAR_EVENT_LABEL_ACTIVE_STATIC_HEIGHT
    activeHeight: 35

  getInitialState: ->
    @getStateByProps()

  getStateByProps: (props) ->
    props ?= @props

    {item} = props
    {plan} = item

    publishStatus = PlanPublishStore.getAsyncStatus(plan.id)

    isViewingStats: @_doesPlanMatchesRoute(props)
    publishStatus: publishStatus
    isPublishing: PlanPublishStore.isPublishing(plan.id)
    isHovered: false
    isPublished: plan.is_published

  # utility functions for functions called in lifecycle methods
  _doesPlanMatchesRoute: (props) ->
    props ?= @props

    {item} = props
    {plan} = item

    {planId} = @props.currentPlan or Router.currentParams()
    planId is plan.id

  _getExpectedRoute: (isViewingStats) ->
    closedRouteName = 'calendarByDate'
    openedRouteName = 'calendarViewPlanStats'

    if isViewingStats then openedRouteName else closedRouteName

  _getExpectedParams: (isViewingStats) ->
    planId = @props.item.plan.id

    params = Router.currentParams()
    closedParams = _.omit(params, 'planId')
    openedParams = _.extend({}, params, {planId})

    if isViewingStats then openedParams else closedParams

  _updateRoute: (isViewingStats) ->
    expectedRoute = @_getExpectedRoute(isViewingStats)
    expectedParams = @_getExpectedParams(isViewingStats)
    currentParams = Router.currentParams()
    unless _.isEqual(currentParams, expectedParams)
      expectedParams.date ?= @context.dateFormatted
      @context.router.history.push(Router.makePathname(expectedRoute, expectedParams))

  # handles when route changes and modal show/hide needs to sync
  # i.e. when using back or forward on browser
  syncRoute: ->
    isViewingStats = @_doesPlanMatchesRoute()
    @setState({isViewingStats})

  # handles when plan is clicked directly and viewing state and route both need to update
  syncIsViewingStats: (isViewingStats) ->
    @_updateRoute(isViewingStats)
    @setState({isViewingStats})

  checkPublishingStatus: (published) ->
    {plan} = @props.item
    planId = plan.id
    if published.for is planId
      planStatus =
        publishStatus: published.status
        isPublishing: PlanPublishStore.isPublishing(planId)
        isPublished: plan.is_published or PlanPublishStore.isSucceeded(planId)

      @setState(planStatus)
      PlanPublishStore.removeAllListeners("progress.#{planId}.*", @checkPublishingStatus) if PlanPublishStore.isDone(planId)

  subscribeToPublishing: (plan) ->
    publishState = PlanHelper.subscribeToPublishing(plan, @checkPublishingStatus)
    @setState(publishState)

  componentWillMount: ->
    {plan} = @props.item
    publishState = PlanHelper.subscribeToPublishing(plan, @checkPublishingStatus)
    isViewingStats = @_doesPlanMatchesRoute()

    state = _.extend({isViewingStats}, publishState)
    @setState(state)

  componentWillReceiveProps: (nextProps) ->
    if @props.item.plan.id isnt nextProps.item.plan.id
      publishState = PlanHelper.subscribeToPublishing(nextProps.item.plan, @checkPublishingStatus)
      @stopCheckingPlan(@props.item.plan)
      state = _.extend(@getStateByProps(nextProps), publishState)
      @setState(state)
    else if nextProps.item.plan.isPublishing and not @props.item.plan.isPublishing
      @subscribeToPublishing(nextProps.item.plan)
    else
      @syncRoute()

  componentDidMount: ->
    @props.onShow?(@props.item.plan)

  componentWillUnmount: ->
    @props.onHide?(@props.item.plan)
    @stopCheckingPlan(@props.item.plan)

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

  hasReview: ->
    {isPublished} = @state
    {item} = @props
    {plan} = item

    isPublished and plan.isOpen and plan.type isnt 'event'

  buildPlanClasses: (plan, publishStatus, isPublishing, isPublished, isActive) ->
    planClasses = classnames 'plan-label-long', "course-plan-#{plan.id}",
      'is-published'  : isPublished
      'is-publishing' : isPublishing
      'is-open'       : plan.isOpen
      'is-new'        : plan.isNew
      'is-trouble'    : plan.isTrouble
      'active'        : isActive,
      "is-#{publishStatus}": publishStatus

  renderDisplay: (hasQuickLook, hasReview, planClasses, display) ->
    {rangeDuration, offset, offsetFromPlanStart, index} = display
    {item, courseId} = @props
    {plan, displays} = item

    labelProps = {rangeDuration, plan, index, offset, offsetFromPlanStart}
    label = <CoursePlanLabel {...labelProps} ref="label#{index}"/>

    DisplayComponent = if hasQuickLook
      CoursePlanDisplayQuickLook
    else
      CoursePlanDisplayEdit

    displayComponentProps = {
      plan,
      display,
      label,
      courseId,
      planClasses,
      hasReview,
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
    hasReview = @hasReview()

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
        onHide: _.partial(@syncIsViewingStats, false)
        ref: 'details'
        isPublished: isPublished
        isPublishing: isPublishing
        hasReview: hasReview

      modalProps = _.defaults({}, modalProps, @props)
      planModal = <CoursePlanDetails {...modalProps}/>

    planClasses = "plan #{planClasses}"
    renderDisplay = _.partial(@renderDisplay, @canQuickLook(), hasReview, planClasses)
    planDisplays = _.map(displays, renderDisplay)

    <div>
      {planDisplays}
      {planModal}
    </div>


module.exports = CoursePlan
