_ = require 'underscore'

React = require 'react'
CoursePlan = require './plan'

CoursePlansByWeek = React.createClass
  displayName: 'CoursePlansByWeek'

  propTypes:
    range: React.PropTypes.object.isRequired

  getDefaultProps: ->
    range: {}

  render: ->
    {range, courseId} = @props
    plans = _.map(range.plans, (item) ->
      <CoursePlan item={item} key="course-plan-#{item.plan.id}" courseId={courseId}/>
    )

    # CALENDAR_EVENT_DYNAMIC_POSITION
    # Adjust based on which week of the month
    plansStyle = {
      top: (range.topOffset + 4 - range.plans.length * 2.6) + 'rem'
    }

    <div className='plans' style={plansStyle} ref='plansByWeek'>
      {plans}
    </div>

module.exports = CoursePlansByWeek
