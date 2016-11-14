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
    {courseId, hasPeriods} = @props

    <div className='calendar-header'>
      <BS.Row className='calendar-header-actions'>
        {<NoPeriods
          courseId={courseId}
          noPanel={true}
        /> unless hasPeriods}

        <SidebarToggle onToggle={@props.onSidebarToggle} />

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
      </BS.Row>
    </div>


module.exports = CourseCalendarHeader
