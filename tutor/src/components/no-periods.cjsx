_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
TutorLink = require './link'

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
        <TutorLink
          className='no-periods-text'
          to='courseSettings'
          params={{courseId}}>
          {@getMessage()}
        </TutorLink>
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
