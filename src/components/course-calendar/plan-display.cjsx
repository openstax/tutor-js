React = require 'react'
Router = require 'react-router'
camelCase = require 'camelcase'
BS = require 'react-bootstrap'

DisplayProperties =
  plan: React.PropTypes.object.isRequired
  display: React.PropTypes.object.isRequired
  label: React.PropTypes.node.isRequired
  courseId: React.PropTypes.string.isRequired
  planClasses: React.PropTypes.string.isRequired
  setHover: React.PropTypes.func.isRequired
  isFirst: React.PropTypes.bool
  isLast: React.PropTypes.bool
  setIsViewing: React.PropTypes.func
  spacingMargin: React.PropTypes.number

CoursePlanDisplayMixin =

  propTypes: DisplayProperties
  getDefaultProps: ->
    isFirst: false
    isLast: false
    spacingMargin: 2
    rangeLength: 7
    defaultPlansCount: 3

  calcPercentOfRangeLength: (partLength) ->
    partLength / @props.rangeLength * 100 + '%'

  adjustPlanSpacing: (planStyle) ->
    {isFirst, isLast, spacingMargin} = @props

    if isFirst or isLast
      planStyle.width = "calc(#{planStyle.width} - #{spacingMargin * 3}px)"

    if isFirst
      planStyle.marginLeft = spacingMargin + 'px'

    unless isFirst or isLast
      planStyle.marginLeft = -1 * spacingMargin + 'px'

    planStyle

  buildPlanStyles: ->
    {display, plan, spacingMargin, defaultPlansCount} = @props
    {offset, weekTopOffset, order} = display
    {durationLength} = plan

    # Adjust width based on plan duration and left position based on offset of plan from start of week
    # CALENDAR_EVENT_DYNAMIC_WIDTH and CALENDAR_EVENT_DYNAMIC_POSITION
    # top is calculated by using:
    #   weekTopOffset -- the distance from the top of the calendar for plans in the same week
    #   order -- the order the plan should be from the bottom, is an int more than 1 when a plan needs to
    #       stack on top of other plans that overlap in duration.
    planStyle =
      width: @calcPercentOfRangeLength(durationLength)
      left: @calcPercentOfRangeLength(offset)
      top: (weekTopOffset + (spacingMargin * 2) - order * defaultPlansCount) + 'rem'

    @adjustPlanSpacing(planStyle)


CoursePlanDisplayEdit = React.createClass
  displayName: 'CoursePlanDisplayEdit'
  mixins: [CoursePlanDisplayMixin]
  render: ->
    {plan, planClasses, label, courseId, setHover} = @props

    linkTo = camelCase("edit-#{plan.type}")
    params = {id: plan.id, courseId}

    planStyle = @buildPlanStyles()

    <div
      style={planStyle}
      className={planClasses}
      onMouseEnter={setHover.bind(null, true)}
      onMouseLeave={setHover.bind(null, false)}
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
    {planClasses, planModal, label, setHover, setIsViewing} = @props

    planStyle = @buildPlanStyles()

    <div
      style={planStyle}
      className={planClasses}
      onMouseEnter={setHover.bind(null, true)}
      onMouseLeave={setHover.bind(null, false)}
      onClick={setIsViewing.bind(null, true)}
      ref='plan'>
      {label}
    </div>


module.exports = {CoursePlanDisplayEdit, CoursePlanDisplayQuickLook}
