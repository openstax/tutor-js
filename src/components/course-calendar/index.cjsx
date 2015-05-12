moment = require 'moment'
React = require 'react'

CourseMonth = require './month'
{TimeStore} = require '../../flux/time'

displayAs =
  month: CourseMonth

CourseCalendar = React.createClass
  displayName: 'CourseCalendar'

  getInitialState: ->
    displayAs: 'month'

  render: ->
    Handler = displayAs[@state.displayAs]
    <Handler startDate={moment(TimeStore.getNow())} {...@props} ref='calendarHandler'/>

module.exports = CourseCalendar
