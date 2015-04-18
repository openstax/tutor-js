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
    React.findDOMNode(@refs.plansByWeek).style.width = @getDOMNode().parentElement.clientWidth + 'px'
    React.findDOMNode(@refs.plansByWeek).style.left = @getDOMNode().parentElement.offsetLeft + 'px'

  render: ->
    {range, courseId} = @props
    plans = _.map(range.plans, (item) ->
        <CoursePlan item={item} key="course-plan-#{item.plan.id}" courseId={courseId}/>
    , @)

    plansStyle = {
        top: (range.topOffset + 4 - range.plans.length*2.6) + 'rem'
    }

    <div className='plans' style={plansStyle} ref='plansByWeek'>
      {plans}
    </div>

module.exports = CoursePlansByWeek
