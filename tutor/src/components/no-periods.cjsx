_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'

CourseGroupingLabel = require './course-grouping-label'

NoPeriods = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    noPanel:  React.PropTypes.bool

  render: ->
    message =
      <span className='-no-periods-text'>
        Please add at least
        one <CourseGroupingLabel lowercase courseId={@props.courseId} /> to
        the course.
      </span>

    if @props.noPanel
      message
    else
      <BS.Panel>
        {message}
      </BS.Panel>

module.exports = NoPeriods
