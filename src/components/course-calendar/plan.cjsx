moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
Router = require 'react-router'
camelCase = require 'camelcase'
BS = require 'react-bootstrap'

CoursePlanDetails = require './plan-details'

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
    triggerPlanStats: false
    isViewingStats: false

  showPlanStats: ->
    if @state.triggerPlanStats and not @state.isViewingStats and @refs.trigger?
      triggerEl = @refs.trigger.getDOMNode()
      triggerEl.click()

  updateViewPlanStatesByParams: ->
    {planId} = @context.router.getCurrentParams()

    if planId is @props.item.plan.id
      @setState(triggerPlanStats: true)

  componentWillMount: ->
    @updateViewPlanStatesByParams()

  componentWillUpdate: (nextProps, nextState) ->
    {planId} = @context.router.getCurrentParams()

    if (planId is @props.item.plan.id) and not nextState.isViewingStats
      nextState.triggerPlanStats = true
    else if not planId? and @state.isViewingStats
      # close modal if there is not a planId in the route and modal is open
      nextState.triggerPlanStats = false
      nextState.isViewingStats = false
      @refs.trigger.hide(true)

  componentDidMount: ->
    @closePlanOnModalHide()
    @adjustForLongLabels()

    @showPlanStats()

  componentDidUpdate: ->
    @adjustForLongLabels()

    @showPlanStats()

  adjustForLongLabels: ->
    labelDOMNode = @refs.label?.getDOMNode()
    planDOMNode = @refs.plan.getDOMNode()

    # HACK: sometimes a label is not rendered. Not sure why
    if labelDOMNode
      planDOMNode.classList.add('plan-label-long') if labelDOMNode.clientHeight > @props.activeHeight

  findPlanNodes: (planNode) ->
    container = @getDOMNode().parentElement.parentElement
    classes = '.' + Array.prototype.join.call(planNode.classList, '.')
    samePlans = Array.prototype.slice.call(container.querySelectorAll(classes))

  closePlanOnModalHide: ->
    if @refs.trigger?
      hide = @refs.trigger.hide
      trigger = React.findDOMNode(@refs.trigger)
      syncClosePlan = @syncClosePlan
      updateClosePlan = @updateClosePlan

      # alias modal hide to also make plan look un-selected
      @refs.trigger.hide  = (silent = false) ->
        hide()
        syncClosePlan(trigger)
        updateClosePlan() unless silent

  syncOpenPlan: (mouseEvent, key) ->
    samePlans = @findPlanNodes(mouseEvent.currentTarget)
    samePlans.forEach((element) ->
      element.classList.add('open')
    )
    params = @context.router.getCurrentParams()
    params.planId = @props.item.plan.id
    @setState(triggerPlanStats: false, isViewingStats: true)
    # store plan id in route as part of history if opened
    # if a link from the modal is clicked, then back will transition back
    # with this plan stat open
    @context.router.transitionTo('calendarViewPlanStats', params)

  syncClosePlan: (trigger) ->
    samePlans = @findPlanNodes(trigger)
    samePlans.forEach((element) ->
      element.classList.remove('open')
    )

  updateClosePlan: ->
    params = @context.router.getCurrentParams()
    @setState(isViewingStats: false)
    @context.router.transitionTo('calendarByDate', params)

  syncHover: (mouseEvent, key) ->
    samePlans = @findPlanNodes(mouseEvent.currentTarget)
    samePlans.forEach((element) ->
      element.classList.add('active')
    )

  removeHover: (mouseEvent, key) ->
    samePlans = @findPlanNodes(mouseEvent.currentTarget)
    samePlans.forEach((element) ->
      element.classList.remove('active')
    )

  renderLabel: (rangeDuration, durationLength, plan, index, offset) ->
    # Adjust width based on plan duration, helps with label centering on view...for the most part.
    # CALENDAR_EVENT_LABEL_DYNAMIC_WIDTH
    rangeLength = rangeDuration.length('days')
    planLabelStyle =
      width: rangeLength / durationLength * 100 + '%'

    # label should float right if the plan is cut off at the beginning of the week
    if offset < 0
      planLabelStyle.float = 'right'

    labelClass = 'continued' unless index is 0

    label = <label style={planLabelStyle} ref='label' className={labelClass}>{plan.title}</label>

  renderOpenPlan: (planStyle, planClasses, label) ->
    {item, courseId} = @props
    {plan} = item

    planModalClasses = 'is-trouble' if plan.isTrouble

    planModal = <CoursePlanDetails plan={plan} courseId={courseId} className={planModalClasses}/>

    <BS.ModalTrigger modal={planModal} ref='trigger'>
      <div style={planStyle}
        className={planClasses}
        onMouseEnter={@syncHover}
        onMouseLeave={@removeHover}
        onClick={@syncOpenPlan}
        ref='plan'>
        {label}
      </div>
    </BS.ModalTrigger>

  renderEditPlan: (planStyle, planClasses, label) ->
    {item, courseId} = @props
    {plan} = item

    linkTo = camelCase("edit-#{plan.type}")
    params = {id: plan.id, courseId}

    <div
      style={planStyle}
      className={planClasses}
      onMouseEnter={@syncHover}
      onMouseLeave={@removeHover}
      ref='plan'>
      <Router.Link
        to={linkTo}
        params={params}>
          {label}
      </Router.Link>
    </div>

  render: ->
    {item, courseId} = @props
    {plan, duration, rangeDuration, offset, index, weekTopOffset, order} = item

    durationLength = duration.length('days')
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

    planClasses = [
      'plan'
      "#{plan.type}"
      "course-plan-#{plan.id}"
    ]

    planClasses.push('is-published') if plan.isPublished
    planClasses.push('is-open') if plan.isOpen
    planClasses.push('is-trouble') if plan.isTrouble

    planClasses = planClasses.join(' ')

    label = @renderLabel(rangeDuration, durationLength, plan, index, offset)

    renderFn = 'renderEditPlan'
    renderFn = 'renderOpenPlan' if plan.isOpen and plan.isPublished

    @[renderFn](planStyle, planClasses, label)

module.exports = CoursePlan
