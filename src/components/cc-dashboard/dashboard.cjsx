React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{CCDashboardStore} = require '../../flux/cc-dashboard'
{CoursePeriodsNav} = require '../course-periods-nav'
Icon = require '../icon'
CourseDataMixin = require '../course-data-mixin'
DashboardChapter = require './chapter'

CCDashboard = React.createClass
  mixins: [CourseDataMixin]
  getDefaultProps: ->
    initialActivePeriod: 0

  getInitialState: ->
    activePeriod = CCDashboardStore.getPeriods(@props.id)?[@props.initialActivePeriod]
    activePeriodId: activePeriod?.id

  handlePeriodSelect: (period) ->
    @setState({activePeriodId: period.id})

  render: ->
    courseId = @props.id
    periods = CCDashboardStore.getPeriods(courseId)
    chapters = CCDashboardStore.chaptersForDisplay(courseId, @state.activePeriodId)
    courseDataProps = @getCourseDataProps(courseId)

    <BS.Panel {...courseDataProps} className='reading-stats tutor-booksplash-background'>
      <Router.Link className='detailed-scores btn btn-default'
        to='viewScores' params={{courseId}}
      >
        View Detailed Scores
      </Router.Link>
      <CoursePeriodsNav
        handleSelect={@handlePeriodSelect}
        initialActive={@props.initialActivePeriod}
        periods={periods}
        courseId={courseId} />
      <BS.Row className="column-legend">
        <BS.Col xs={2} xsOffset={6}>
          Complete
          <Icon type='info-circle'
            tooltipProps={placement: 'top'}
            tooltip='Displays the percentage of students who have completed concept coach questions for a given section' />
        </BS.Col>
        <BS.Col xs={2}>
          Original Performance
          <Icon type='info-circle'
            tooltipProps={placement: 'top'}
            tooltip='Indicates the ratio of students that have correctly answered the ConceptCoach questions' />
        </BS.Col>
        <BS.Col xs={2}>
          Spaced Practice Performance
          <Icon type='info-circle'
            tooltipProps={placement: 'top'}
            tooltip='Indicates how well students performed on system assigned problems' />
        </BS.Col>
      </BS.Row>
      {for chapter, index in chapters
        <DashboardChapter chapter={chapter} key={index} />}
    </BS.Panel>

module.exports = CCDashboard
