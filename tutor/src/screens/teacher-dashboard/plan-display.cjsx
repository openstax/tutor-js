React = require 'react'
ReactDOM = require 'react-dom'
camelCase = require 'lodash/camelCase'
BS = require 'react-bootstrap'
_ = require 'underscore'

TutorLink = require '../../components/link'
TaskPlanMiniEditor = require '../../components/task-plan/mini-editor'

DisplayProperties =
  plan: React.PropTypes.shape(
    id: React.PropTypes.string.isRequired
    durationLength: React.PropTypes.number.isRequired
  ).isRequired
  display: React.PropTypes.shape(
    offset: React.PropTypes.number.isRequired
    order: React.PropTypes.number.isRequired
    weekTopOffset: React.PropTypes.number.isRequired
  ).isRequired
  label: React.PropTypes.node.isRequired
  courseId: React.PropTypes.string.isRequired
  planClasses: React.PropTypes.string.isRequired
  setHover: React.PropTypes.func.isRequired
  hasReview: React.PropTypes.bool
  isFirst: React.PropTypes.bool
  isLast: React.PropTypes.bool
  setIsViewing: React.PropTypes.func
  spacingMargin: React.PropTypes.number

CoursePlanDisplayMixin =

  propTypes: DisplayProperties
  getDefaultProps: ->
    hasReview: false
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
      data-assignment-type={plan.type}
      onMouseEnter={_.partial(setHover, true)}
      onMouseLeave={_.partial(setHover, false)}
      ref='plan'>
      <TutorLink
        to={linkTo}
        params={params}>
          {label}
      </TutorLink>
    </div>

CoursePlanDisplayMiniEditor = React.createClass
  mixins: [CoursePlanDisplayMixin]

  getInitialState: ->
    isShowingEditor: false

  getElement: ->
    ReactDOM.findDOMNode(@)

  showEditor: ->
    @setState(isShowingEditor: true)
  onEditorHide: ->
    @setState(isShowingEditor: false)

  render: ->
    {plan, planClasses, label, courseId, setHover} = @props

    linkTo = camelCase("edit-#{plan.type}")
    params = {id: plan.id, courseId}

    planStyle = @buildPlanStyles()

    <div
      style={planStyle}
      className={planClasses}
      data-assignment-type={plan.type}
      onMouseEnter={_.partial(setHover, true)}
      onMouseLeave={_.partial(setHover, false)}
      ref='plan'
    >

      {<TaskPlanMiniEditor
        planId={plan.id}
        courseId={@props.courseId}
        onHide={@onEditorHide}
        findPopOverTarget={@getElement}
      /> if @state.isShowingEditor}

      <div onClick={@showEditor}>
          {label}
      </div>
    </div>



CoursePlanDisplayQuickLook = React.createClass
  displayName: 'CoursePlanDisplayQuickLook'
  mixins: [CoursePlanDisplayMixin]

  render: ->
    {planClasses, planModal, label, setHover, setIsViewing, plan, hasReview} = @props

    planStyle = @buildPlanStyles()

    <div
      style={planStyle}
      className={planClasses}
      data-assignment-type={plan.type}
      data-has-review={hasReview}
      onMouseEnter={_.partial(setHover, true)}
      onMouseLeave={_.partial(setHover, false)}
      onClick={_.partial(setIsViewing, true)}
      ref='plan'>
      {label}
    </div>


module.exports = {CoursePlanDisplayEdit, CoursePlanDisplayQuickLook, CoursePlanDisplayMiniEditor}
