React = require 'react'
Router = require 'react-router'
camelCase = require 'camelcase'
BS = require 'react-bootstrap'

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

    planStyle = @buildPlanStyles()

    planOnly = <div style={planStyle}
      className={planClasses}
      onMouseEnter={syncHover}
      onMouseLeave={removeHover}
      onClick={syncOpenPlan}
      ref='plan'>
      {label}
    </div>

    <BS.ModalTrigger modal={planModal} ref='trigger'>
      {planOnly}
    </BS.ModalTrigger>


CoursePlanDisplayEdit = React.createClass
  displayName: 'CoursePlanDisplayEdit'
  mixins: [CoursePlanDisplayMixin]
  render: ->
    {plan, planClasses, display, label, courseId, syncHover, removeHover} = @props
    {index} = display

    linkTo = camelCase("edit-#{plan.type}")
    params = {id: plan.id, courseId}

    planStyle = @buildPlanStyles()

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
    {plan, courseId, planClasses, planModal} = @props

    @renderPlanDisplay(planModal, planClasses)



module.exports = {CoursePlanDisplayEdit, CoursePlanDisplayQuickLook}
