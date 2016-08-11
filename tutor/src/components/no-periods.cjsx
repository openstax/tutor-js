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
      <span key='no-periods-start'>Please add at least one </span>
      <CourseGroupingLabel
        key='no-periods-label'
        lowercase
        courseId={@props.courseId} />
      <span key='no-periods-end'> to the course.</span>
    ]

  render: ->
    {courseId, link} = @props

    if link
      message =
        <Router.Link
          className='no-periods-text'
          to='courseSettings'
          params={{courseId}}>
          {@getMessage()}
        </Router.Link>
    else
      message =
        <span className='no-periods-text'>
          {@getMessage()}
        </span>

    if @props.noPanel
      message
    else
      <BS.Panel>
        {message}
      </BS.Panel>

module.exports = NoPeriods
