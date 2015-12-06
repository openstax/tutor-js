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
    periodChapters = CCDashboardStore.getPeriodChapters(courseId, @state.activePeriodId)

    if _.any(periodChapters)
      chapters = _.map periodChapters.reverse(), (chapter, index) ->
        <DashboardChapter chapter={chapter} key={index} />
    else
      chapters = <div>There are no completed concept coach tasks for this period.</div>
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
      <BS.Row className="dashboard-table-header">
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
      {chapters}
    </BS.Panel>

module.exports = CCDashboard
