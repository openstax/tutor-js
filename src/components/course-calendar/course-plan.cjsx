moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

CoursePlan = React.createClass
  displayName: 'CoursePlan'

  triggerHover: (mouseEvent, key) ->
    classes = '.' + Array.prototype.join.call(mouseEvent.target.classList, '.')
    samePlans = document.querySelectorAll(classes)
    samePlans = Array.prototype.slice.call(samePlans)
    samePlans.forEach((element) ->
      element.classList.add('active')
    )

  removeHover: (mouseEvent, key) ->
    classes = '.' + Array.prototype.join.call(mouseEvent.target.classList, '.')
    samePlans = document.querySelectorAll(classes)
    samePlans = Array.prototype.slice.call(samePlans)
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
    <span style={planStyle} className={planClasses} onClick={-> alert("Clicked #{plan.title}")} onMouseEnter={@triggerHover} onMouseLeave={@removeHover}>{plan.title}</span>

module.exports = CoursePlan
