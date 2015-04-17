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

  renderLabel: (rangeDuration, durationLength, plan, index) ->
    if index is 0
      rangeLength = rangeDuration.length('days')
      planLabelStyle =
        width: rangeLength/durationLength * 100 + '%'
      label = <label style={planLabelStyle}>{plan.title}</label>


  render: ->
    {item} = @props
    {plan, duration, rangeDuration, offset, index} = item

    durationLength = duration.length('days')
    planStyle =
      width: durationLength * 100 / 7 + '%'
      left: offset * 100 / 7 + '%'

    planClasses = "plan #{plan.type} course-plan-#{plan.id}"

    label = @renderLabel(rangeDuration, durationLength, plan, index)

    planModal = <CoursePlanDetails plan={plan}/>

    <BS.ModalTrigger modal={planModal} ref="trigger">
      <div style={planStyle} className={planClasses} onMouseEnter={@syncHover} onMouseLeave={@removeHover} onClick={@toggleModal}>
        {label}
      </div>
    </BS.ModalTrigger>

module.exports = CoursePlan
