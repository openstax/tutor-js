React  = require 'react'
BS     = require 'react-bootstrap'
moment = require 'moment'
Events = require './events-panel'
EmptyPanel  = require './empty-panel'
{TimeStore} = require '../../flux/time'
{StudentDashboardStore} = require '../../flux/student-dashboard'

module.exports = React.createClass
  displayName: 'ThisWeekPanel'
  propTypes:
    courseId: React.PropTypes.string.isRequired

  render: ->
    startAt = moment(TimeStore.getNow())
    events  = StudentDashboardStore.weeklyEventsForDay(@props.courseId, startAt)
    if events.length
      <Events
        className='-this-week'
        courseId={@props.courseId}
        events=events
        startAt={startAt}
        endAt={startAt.clone().add(1, 'week')}
      />
    else
      <EmptyPanel/>
