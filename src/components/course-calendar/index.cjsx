React = require 'react'

CourseMonth = require './month'

displayAs =
  month: CourseMonth

CourseCalendar = React.createClass
  displayName: 'CourseCalendar'

  propTypes:
    loadPlansList: React.PropTypes.func

  render: ->
    Handler = displayAs[@props.displayAs]
    {loadPlansList} = @props
    plansList = loadPlansList?()

    <Handler {...@props} plansList={plansList} ref='calendarHandler'/>

module.exports = CourseCalendar
