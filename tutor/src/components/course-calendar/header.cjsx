React = require 'react'
BS = require 'react-bootstrap'
moment = require 'moment'
_ = require 'underscore'

{ default: TourAnchor } = require '../tours/anchor'
TutorLink     = require '../link'
NoPeriods     = require '../no-periods'
SidebarToggle = require './sidebar-toggle'

CourseCalendarHeader = React.createClass
  displayName: 'CourseCalendarHeader'

  propTypes:
    hasPeriods: React.PropTypes.bool.isRequired
    courseId: React.PropTypes.string.isRequired
    onSidebarToggle: React.PropTypes.func.isRequired
    defaultOpen: React.PropTypes.bool

  render: ->
    {courseId, hasPeriods, defaultOpen} = @props

    <div className='calendar-header'>

      {<NoPeriods
        courseId={courseId}
        noPanel={true}
      /> unless hasPeriods}

      <SidebarToggle
        courseId={@props.courseId}
        defaultOpen={defaultOpen}
        onToggle={@props.onSidebarToggle}
      />

      <div className='calendar-header-actions-buttons'>
        <TourAnchor id="performance-forcast-button">
          <TutorLink
            className='btn btn-default'
            to='viewPerformanceGuide'
            params={{courseId}}
          >
            Performance Forecast
          </TutorLink>
        </TourAnchor>

        <TourAnchor id="student-scores-button">
          <TutorLink className='btn btn-default'
            to='viewScores'
            params={{courseId}}
          >
            Student Scores
          </TutorLink>
        </TourAnchor>
      </div>

    </div>


module.exports = CourseCalendarHeader
