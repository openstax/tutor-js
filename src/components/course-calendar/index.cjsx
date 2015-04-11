moment = require 'moment'
React = require 'react'

CourseMonth = require './course-month'

displayAs =
  month: CourseMonth

CourseCalendar = React.createClass
  displayName: 'CourseCalendar'

  getInitialState: ->
    displayAs: 'month'

  render: ->
    Handler = displayAs[@state.displayAs]

    <Handler/>

module.exports = CourseCalendar
