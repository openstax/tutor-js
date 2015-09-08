moment = require 'moment'
React = require 'react'

CourseMonth = require './month'

displayAs =
  month: CourseMonth

CourseCalendar = React.createClass
  displayName: 'CourseCalendar'

  propTypes:
    loadPlansList: React.PropTypes.func

  getInitialState: ->
    displayAs: 'month'

  render: ->
    Handler = displayAs[@state.displayAs]
    {loadPlansList} = @props
    plansList = loadPlansList?()

    <Handler {...@props} plansList={plansList} ref='calendarHandler'/>

module.exports = CourseCalendar
