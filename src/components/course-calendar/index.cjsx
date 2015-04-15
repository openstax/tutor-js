moment = require 'moment'
React = require 'react'

CourseMonth = require './month'

displayAs =
  month: CourseMonth

CourseCalendar = React.createClass
  displayName: 'CourseCalendar'

  getInitialState: ->
    displayAs: 'month'

  render: ->
    Handler = displayAs[@state.displayAs]
    <Handler startDate={moment()} plansList={@props.plansList}/>

module.exports = CourseCalendar
