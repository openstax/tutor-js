React  = require 'react'
BS     = require 'react-bootstrap'
moment = require 'moment'
EventsPanel = require './events-panel'
{StudentDashboardStore} = require '../../flux/student-dashboard'
_ = require 'underscore'

module.exports = React.createClass
  displayName: 'AllEventsByWeek'
  propTypes:
    courseId: React.PropTypes.any.isRequired

  renderWeek:(events, week) ->
    startAt = moment(week, "YYYYww")
    <EventsPanel
      key={week}
      courseId={@props.courseId}
      events={events}
      startAt={startAt}
      endAt={startAt.clone().add(1, 'week')}
    />

  render: ->
    weeks = StudentDashboardStore.eventsByWeek(@props.courseId)
    if _.any(weeks)
      <div>{_.map(weeks, @renderWeek)}</div>
    else
      <EmptyPanel>No Upcoming Events</EmptyPanel>
