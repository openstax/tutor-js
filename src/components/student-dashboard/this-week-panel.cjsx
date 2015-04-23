React  = require 'react'
BS     = require 'react-bootstrap'
moment = require 'moment'
Events = require './events-panel'
_ = require 'underscore'
EmptyPanel = require './empty-panel'
{StudentDashboardStore} = require '../../flux/student-dashboard'

module.exports = React.createClass
  displayName: 'ThisWeekPanel'
  propTypes:
    courseId: React.PropTypes.any.isRequired

  render: ->
    today   = moment().startOf('day') # FIXME: Replace with server time
    startAt = today.clone().startOf('week')
    events  = StudentDashboardStore.eventsByWeek(@props.courseId)[startAt.format("YYYYww")]
    if _.any(events)
      <Events
        events=events
        startAt={startAt}
        endAt={startAt.clone().add(1, 'week')}
      />
    else
      <EmptyPanel/>
