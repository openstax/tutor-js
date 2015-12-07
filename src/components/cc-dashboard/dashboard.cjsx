React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{CCDashboardStore} = require '../../flux/cc-dashboard'
{CoursePeriodsNav} = require '../course-periods-nav'
{CourseStore} = require '../../flux/course'
Icon = require '../icon'
CourseDataMixin = require '../course-data-mixin'
DashboardChapter = require './chapter'

TOOLTIPS =
  complete: '''
    Complete shows the percentage of students who
    have completed the Concept Coach for this section.
    Students who have not answered all of the Concept Coach
    questions for this section will not be counted, although
    the questions they have answered will be included in the
    Original and Spaced Practice Performance percentages.
  '''
  original: '''
    The original performance shows the percentage of Concept Coach
    questions that students answered correctly on this section of the
    book the first time they were presented. The performance bars
    show up for a section of the book once at least 10% of students
    in the class (or section) have submitted answers.
  '''
  spaced: '''
    Spaced practice performance shows the percentage of Concept Coach
    questions on this section that were correctly answered after the
    section was originally practiced. Compare this measure to
    Original Performance to gauge how well students are retaining
    the information.
  '''

CCDashboard = React.createClass
  mixins: [CourseDataMixin]
  contextTypes:
    router: React.PropTypes.func
  propTypes:
    courseId: React.PropTypes.string

  getDefaultProps: ->
    initialActivePeriod: 0

  getInitialState: ->
    activePeriod = CCDashboardStore.getPeriods(@props.courseId)?[@props.initialActivePeriod]
    activePeriodId: activePeriod?.id

  handlePeriodSelect: (period) ->
    @setState({activePeriodId: period.id})

  render: ->
    {courseId} = @props
    periods = CCDashboardStore.getPeriods(courseId)
    chapters = CCDashboardStore.chaptersForDisplay(courseId, @state.activePeriodId)
    courseDataProps = @getCourseDataProps(courseId)
    course = CourseStore.get(courseId)
    <div className="dashboard">
      <div {...courseDataProps} className='tutor-booksplash-background' />
      <BS.Panel>
        <h2>
          Class Dashboard
        </h2>
        <Router.Link className='detailed-scores btn btn-default'
          to='viewScores' params={courseId: courseId}
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
              tooltip={TOOLTIPS.complete} />
          </BS.Col>
          <BS.Col xs={2}>
            Original Performance
            <Icon type='info-circle'
              tooltipProps={placement: 'top'}
              tooltip={TOOLTIPS.original} />
          </BS.Col>
          <BS.Col xs={2}>
            Spaced Practice Performance
            <Icon type='info-circle'
              tooltipProps={placement: 'top'}
              tooltip={TOOLTIPS.spaced} />
          </BS.Col>
        </BS.Row>
        {for chapter, index in chapters
          <DashboardChapter chapter={chapter} key={index} />}
        <BS.Row>
          <BS.Col className="hide-section-legend" xs={12}>
            Chapters and sections that are less than 10% complete are hidden
          </BS.Col>
        </BS.Row>
      </BS.Panel>
    </div>
module.exports = CCDashboard
