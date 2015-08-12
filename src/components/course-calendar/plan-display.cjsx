React = require 'react'
Router = require 'react-router'
camelCase = require 'camelcase'
BS = require 'react-bootstrap'

DisplayProperties =
  plan: React.PropTypes.object.isRequired
  display: React.PropTypes.object.isRequired
  label: React.PropTypes.node.isRequired
  courseId: React.PropTypes.string.isRequired
  planModal: React.PropTypes.node.isRequired
  planClasses: React.PropTypes.string.isRequired
  syncHover: React.PropTypes.func.isRequired
  removeHover: React.PropTypes.func.isRequired
  syncOpenPlan: React.PropTypes.func
  syncClosePlan: React.PropTypes.func

CoursePlanDisplayMixin =

  propTypes: DisplayProperties

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


CoursePlanDisplayEdit = React.createClass
  displayName: 'CoursePlanDisplayEdit'
  mixins: [CoursePlanDisplayMixin]
  render: ->
    {plan, planClasses, label, courseId, syncHover, removeHover} = @props

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

  componentWillReceiveProps: ->
    @closePlanOnModalHide()

  componentDidMount: ->
    @closePlanOnModalHide()

  closePlanOnModalHide: ->
    hide = @refs.trigger.hide
    syncClosePlan = @props.syncClosePlan

    # alias modal hide to also make plan look un-selected
    @refs.trigger.hide = ->
      hide()
      syncClosePlan()

  render: ->
    {planClasses, planModal, label, syncHover, removeHover, syncOpenPlan} = @props

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


module.exports = {CoursePlanDisplayEdit, CoursePlanDisplayQuickLook}
