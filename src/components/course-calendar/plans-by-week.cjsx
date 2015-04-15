_ = require 'underscore'

React = require 'react'
CoursePlan = require './plan'

CoursePlansByWeek = React.createClass
  displayName: 'CoursePlansByWeek'

  propTypes:
    range: React.PropTypes.object.isRequired

  getDefaultProps: ->
    range: {}

  componentDidMount: ->
    window.addEventListener('resize', @handleResize)
    @handleResize()

  componentWillUnmount: ->
    window.removeEventListener('resize', @handleResize)

  handleResize: ->
    React.findDOMNode(@refs['plans-by-week']).style.width = @getDOMNode().parentElement.clientWidth + 'px'
    React.findDOMNode(@refs['plans-by-week']).style.left = @getDOMNode().parentElement.offsetLeft + 'px'

  render: ->
    {range} = @props
    plans = _.map(range.plans, (item) ->
        <CoursePlan item={item} key="course-plan-#{item.plan.id}" />
    , @)

    plansStyle = {
        top: (range.nthRange * 10 + 13.5 - range.plans.length*2.75) + 'rem'
    }

    <div className='plans' style={plansStyle} ref='plans-by-week'>
      {plans}
    </div>

module.exports = CoursePlansByWeek
