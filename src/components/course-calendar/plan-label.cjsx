React = require 'react'

CoursePlanLabel = React.createClass
  displayName: 'CoursePlanLabel'
  render: ->
    {rangeDuration, plan, index, offset} = @props
    {durationLength, opensAt, title} = plan

    # Adjust width based on plan duration, helps with label centering on view...for the most part.
    # CALENDAR_EVENT_LABEL_DYNAMIC_WIDTH
    rangeLength = rangeDuration.length('days')
    planLabelStyle =
      width: rangeLength / durationLength * 100 + '%'

    # label should float right if the plan is cut off at the beginning of the week
    if offset < 0
      planLabelStyle.float = 'right'

    labelClass = 'continued' unless index is 0

    label = <label
      data-opens-at={opensAt}
      style={planLabelStyle}
      className={labelClass}>{title}</label>

module.exports = CoursePlanLabel
