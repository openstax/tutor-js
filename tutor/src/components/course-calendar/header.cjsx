React = require 'react'
BS = require 'react-bootstrap'
moment = require 'moment'
_ = require 'underscore'


TutorLink     = require '../link'
BrowseTheBook = require '../buttons/browse-the-book'
NoPeriods     = require '../no-periods'
SidebarToggle = require './sidebar-toggle'

CourseCalendarHeader = React.createClass
  displayName: 'CourseCalendarHeader'

  propTypes:
    hasPeriods: React.PropTypes.bool.isRequired
    courseId: React.PropTypes.string.isRequired
    onSidebarToggle: React.PropTypes.func.isRequired

  render: ->
    {courseId, hasPeriods, defaultOpen} = @props

    <div className='calendar-header'>

      {<NoPeriods
        courseId={courseId}
        noPanel={true}
      /> unless hasPeriods}

      <SidebarToggle
        defaultOpen={defaultOpen}
        onToggle={@props.onSidebarToggle}
      />

      <div className='calendar-header-actions-buttons'>

        <BrowseTheBook bsStyle='default' courseId={courseId} />
        <TutorLink
          className='btn btn-default'
          to='viewPerformanceGuide'
          params={{courseId}}
        >
          Performance Forecast
        </TutorLink>
        <TutorLink className='btn btn-default'
          to='viewScores'
          params={{courseId}}
        >
          Student Scores
        </TutorLink>
      </div>

    </div>


module.exports = CourseCalendarHeader
