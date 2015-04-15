moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

# TODO drag and drop, and resize behavior
CoursePlan = React.createClass
  displayName: 'CoursePlan'

  propTypes:
    item: React.PropTypes.object.isRequired
    nthRange: React.PropTypes.number.isRequired

  getDefaultProps: ->
    nthRange: 0

  findPlanNodes: (planNode) ->
    container = @getDOMNode().parentElement.parentElement
    classes = '.' + Array.prototype.join.call(planNode.classList, '.')
    samePlans = Array.prototype.slice.call(container.querySelectorAll(classes))

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

  showDetails: (clickEvent)->
    {item} = @props
    {plan, duration, offset} = item

    # hack for testing for now.
    clickEvent.currentTarget.childNodes[0]?.innerText = JSON.stringify(plan)
    alert(plan.title)
    console.info(plan)

  render: ->
    {item, nthRange} = @props
    {plan, duration, rangeDuration, offset} = item

    durationLength = duration.length('days')
    planStyle =
      width: durationLength * 100 / 7 + '%'
      left: offset * 100 / 7 + '%'

    planClasses = "plan #{plan.type} course-plan-#{plan.id}"

    if nthRange is 0
      rangeLength = rangeDuration.length('days')
      planLabelStyle =
        width: rangeLength/durationLength * 100 + '%'
      label = <label style={planLabelStyle}>{plan.title}</label>

    <div style={planStyle} className={planClasses} onMouseEnter={@syncHover} onMouseLeave={@removeHover} onClick = {@showDetails}>
      {label}
    </div>

module.exports = CoursePlan
