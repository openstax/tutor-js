React = require 'react'
moment = require 'moment'
{TimeStore} = require '../../flux/time'

CourseMonth = require './month'

displayAs =
  month: CourseMonth

CourseCalendar = React.createClass
  displayName: 'CourseCalendar'

  propTypes:
    loadPlansList: React.PropTypes.func

  getInitialState: ->
    displayAs: 'month'

  componentWillMount: ->
    first = moment(TimeStore.getNow()).startOf(@state.displayAs)
    last = first.clone().endOf(@state.displayAs)
    @updateRange(first, last)

  updateRange: (first, last) ->
    @props.loadPlansList(first.subtract(1, 'day'), last.add(1, 'day'))

  render: ->
    Handler = displayAs[@state.displayAs]

    <Handler {...@props} onDisplayRangeUpdate={@updateRange} ref='calendarHandler'/>

module.exports = CourseCalendar
