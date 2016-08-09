_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

CourseGroupingLabel = require './course-grouping-label'

NoPeriods = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    noPanel:  React.PropTypes.bool
    link:  React.PropTypes.bool

  getDefaultProps: ->
    link: true

  getMessage: ->
    [
      'Please add at least one '
      <CourseGroupingLabel lowercase courseId={@props.courseId} />
      ' to the course.'
    ]

  render: ->
    {courseId, link} = @props

    if link
      message =
        <Router.Link
          className='-no-periods-text'
          to='courseSettings'
          params={{courseId}}>
          {@getMessage()}
        </Router.Link>
    else
      message =
        <span className='-no-periods-text'>
          {@getMessage()}
        </span>

    if @props.noPanel
      message
    else
      <BS.Panel>
        {message}
      </BS.Panel>

module.exports = NoPeriods
