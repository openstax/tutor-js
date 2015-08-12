React = require 'react'
Router = require 'react-router'
camelCase = require 'camelcase'
BS = require 'react-bootstrap'

CoursePlanDetails = require './plan-details'
CoursePlanPublishingDetails = require './plan-publishing-details'


CoursePlanDisplayMixin =

  componentWillReceiveProps: ->
    @closePlanOnModalHide()

  componentDidMount: ->
    @closePlanOnModalHide()

  closePlanOnModalHide: ->
    if @refs.trigger?
      hide = @refs.trigger.hide
      syncClosePlan = @props.syncClosePlan

      # alias modal hide to also make plan look un-selected
      @refs.trigger.hide = ->
        hide()
        syncClosePlan()

  buildPlanClasses: ->
    {plan, publishStatus, isPublishing, isActive} = @props

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

  buildPlanStyles: ->
    {display, plan} = @props
    {offset, weekTopOffset, order} = display
    {durationLength} = plan

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

  renderPlanDisplay: (planModal, planClasses) ->
    {display, label, syncHover, removeHover, syncOpenPlan} = @props
    {index} = display

    hasModal = index is 0

    planStyle = @buildPlanStyles()

    planOnly = <div style={planStyle}
      className={planClasses}
      onMouseEnter={syncHover}
      onMouseLeave={removeHover}
      onClick={syncOpenPlan(hasModal)}
      ref='plan'>
      {label}
    </div>

    if hasModal
      # only trigger modal if this is the first component representing the plan
      planDisplay = <BS.ModalTrigger modal={planModal} ref='trigger'>
        {planOnly}
      </BS.ModalTrigger>
    else
      # otherwise, if this plan continues into the next week, don't add an additional modal
      planDisplay = planOnly

    planDisplay


CoursePlanDisplayEdit = React.createClass
  displayName: 'CoursePlanDisplayEdit'
  mixins: [CoursePlanDisplayMixin]
  render: ->
    {plan, display, label, courseId, syncHover, removeHover} = @props
    {index} = display

    linkTo = camelCase("edit-#{plan.type}")
    params = {id: plan.id, courseId}

    planStyle = @buildPlanStyles()
    planClasses = @buildPlanClasses()

    <div
      style={planStyle}
      className={planClasses}
      onMouseEnter={syncHover}
      onMouseLeave={removeHover}
      ref='plan'>
      <Router.Link
        to={linkTo}
        params={params}>
          {label}
      </Router.Link>
    </div>


CoursePlanDisplayQuickLook = React.createClass
  displayName: 'CoursePlanDisplayQuickLook'
  mixins: [CoursePlanDisplayMixin]
  render: ->
    {plan, courseId} = @props
    planClasses = @buildPlanClasses()

    planModal = <CoursePlanDetails
      plan={plan}
      courseId={courseId}
      className={planClasses}
      ref='details'/>

    @renderPlanDisplay(planModal, planClasses)


CoursePlanDisplayPublishing = React.createClass
  displayName: 'CoursePlanDisplayPublishing'
  mixins: [CoursePlanDisplayMixin]
  render: ->
    {plan, courseId} = @props
    planClasses = @buildPlanClasses()

    planModal = <CoursePlanPublishingDetails
      plan={plan}
      courseId={courseId}
      className={planClasses}
      ref='details'/>

    @renderPlanDisplay(planModal, planClasses)


module.exports = {CoursePlanDisplayEdit, CoursePlanDisplayQuickLook, CoursePlanDisplayPublishing}
