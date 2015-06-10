moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

CoursePlanDetails = require './plan-details'

# TODO drag and drop, and resize behavior
CoursePlan = React.createClass
  displayName: 'CoursePlan'

  propTypes:
    item: React.PropTypes.object.isRequired

  componentDidMount: ->
    hide = @refs.trigger.hide
    trigger = React.findDOMNode(@refs.trigger)
    closeModal = @closeModal

    # alias modal hide to also make plan look un-selected
    @refs.trigger.hide  = ->
      hide()
      closeModal(trigger)
      

  findPlanNodes: (planNode) ->
    container = @getDOMNode().parentElement.parentElement
    classes = '.' + Array.prototype.join.call(planNode.classList, '.')
    samePlans = Array.prototype.slice.call(container.querySelectorAll(classes))

  toggleModal: (mouseEvent, key) ->
    samePlans = @findPlanNodes(mouseEvent.currentTarget)
    samePlans.forEach((element) ->
      element.classList.add('open')
    )

  closeModal: (trigger) ->
    samePlans = @findPlanNodes(trigger)
    samePlans.forEach((element) ->
      element.classList.remove('open')
    )

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
    if index is 0
      rangeLength = rangeDuration.length('days')
      planLabelStyle =
        width: rangeLength / durationLength * 100 + '%'

      # label should float right if the plan is cut off at the beginning of the week
      if offset < 0
        planLabelStyle.float = 'right'

      label = <label style={planLabelStyle}>{plan.title}</label>


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

    planLabelClass = 'plan-label-long' if plan.title.length > 18
    planClasses = "plan #{plan.type} course-plan-#{plan.id} #{planLabelClass}"

    label = @renderLabel(rangeDuration, durationLength, plan, index, offset)

    planModal = <CoursePlanDetails plan={plan} courseId={courseId}/>

    <BS.ModalTrigger modal={planModal} ref='trigger'>
      <div style={planStyle}
        className={planClasses}
        onMouseEnter={@syncHover}
        onMouseLeave={@removeHover}
        onClick={@toggleModal}>
        {label}
      </div>
    </BS.ModalTrigger>

module.exports = CoursePlan
