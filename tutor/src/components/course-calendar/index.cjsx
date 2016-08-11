React = require 'react'

CourseMonth = require './month'

displayAsHandler =
  month: CourseMonth

CourseCalendar = React.createClass
  displayName: 'CourseCalendar'

  propTypes:
    loadPlansList: React.PropTypes.func
    hasPeriods: React.PropTypes.bool.isRequired

  render: ->
    {hasPeriods, displayAs, loadPlansList} = @props
    Handler = displayAsHandler[displayAs]

    plansList = if hasPeriods then loadPlansList?() else []

    <Handler {...@props} plansList={plansList} ref='calendarHandler'/>

module.exports = CourseCalendar
