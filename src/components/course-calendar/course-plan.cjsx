moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

# TODO drag and drop, and resize behavior
CoursePlan = React.createClass
  displayName: 'CoursePlan'

  findPlanNodes: (planNode) ->
    container = @getDOMNode().parentElement.parentElement
    classes = '.' + Array.prototype.join.call(planNode.classList, '.')
    samePlans = Array.prototype.slice.call(container.querySelectorAll(classes))

  syncHover: (mouseEvent, key) ->
    samePlans = @findPlanNodes(mouseEvent.target)
    samePlans.forEach((element) ->
      element.classList.add('active')
    )

  removeHover: (mouseEvent, key) ->
    samePlans = @findPlanNodes(mouseEvent.target)
    samePlans.forEach((element) ->
      element.classList.remove('active')
    )

  render: ->
    {item} = @props
    {plan, duration, offset} = item

    durationLength = if duration.length('days') < 7 then duration.length('days') + 1 else duration.length('days')
    planStyle = {
      width: durationLength * 100 / 7 + '%'
      left: offset * 100 / 7 + '%'
    }

    planClasses = "plan #{plan.type} course-plan-#{plan.id}"
    <span style={planStyle} className={planClasses} onClick={-> alert("Clicked #{plan.title}")} onMouseEnter={@syncHover} onMouseLeave={@removeHover}>{plan.title}</span>

module.exports = CoursePlan
