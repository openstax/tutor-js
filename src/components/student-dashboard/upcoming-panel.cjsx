React  = require 'react'
BS     = require 'react-bootstrap'
moment = require 'moment'
EventsPanel = require './events-panel'
EmptyPanel  = require './empty-panel'
{StudentDashboardStore} = require '../../flux/student-dashboard'

module.exports = React.createClass
  displayName: 'UpcomingPanel'
  propTypes:
    courseId: React.PropTypes.any.isRequired

  render: ->
    today   = moment().startOf('day') # FIXME: Replace with server time
    nextWeek = today.startOf('week').add(1, "week").format("YYYYww")
    events = StudentDashboardStore.eventsByWeek(@props.courseId)
    if events[nextWeek]
      <EventsPanel
        events=events[nextWeek]
        title="Coming Up"
      />
    else
      <EmptyPanel/>

