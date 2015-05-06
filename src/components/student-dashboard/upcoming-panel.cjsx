React  = require 'react'
BS     = require 'react-bootstrap'
moment = require 'moment'
EventsPanel = require './events-panel'
EmptyPanel  = require './empty-panel'
{TimeStore} = require '../../flux/time'
{StudentDashboardStore} = require '../../flux/student-dashboard'

module.exports = React.createClass
  displayName: 'UpcomingPanel'
  propTypes:
    courseId: React.PropTypes.string.isRequired

  render: ->
    startAt = moment(TimeStore.getNow()).startOf('isoweek').add(1, 'week')
    events  = StudentDashboardStore.upcomingEvents(@props.courseId, startAt)
    if events.length
      <EventsPanel
        className='-upcoming'
        onTaskClick={@onTaskClick}
        courseId={@props.courseId}
        events=events
        title='Coming Up'
      />
    else
      <EmptyPanel>No upcoming events</EmptyPanel>
