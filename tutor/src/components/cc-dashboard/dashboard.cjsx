React = require 'react'
BS = require 'react-bootstrap'
TutorLink = require '../link'

Courses = require('../../models/courses-map').default

{NotificationsBar} = require 'shared'
{CCDashboardStore} = require '../../flux/cc-dashboard'
{CoursePeriodsNav} = require '../course-periods-nav'

Icon = require '../icon'
DashboardChapter = require './chapter'
EmptyPeriod = require './empty-period'
CourseTitleBanner = require '../course-title-banner'
NotificationHelpers = require '../../helpers/notifications'

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

  propTypes:
    courseId: React.PropTypes.string

  # router context is needed for Navbar helpers
  contextTypes:
    router: React.PropTypes.object

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

    course = Courses.get(courseId)
    emptyPeriod = chapters.length is 0
    emptyGraphic = <EmptyPeriod courseId={courseId} />

    dashboardResults =
      <div className="results">
        <BS.Row className="column-legend">
          <BS.Col xs={2} xsOffset={6}>
            <span className="title">Complete
            <Icon type='info-circle'
              tooltipProps={placement: 'top'}
              tooltip={TOOLTIPS.complete} /></span>
          </BS.Col>
          <BS.Col xs={2}>
            <span className="title">Original
            <Icon type='info-circle'
              tooltipProps={placement: 'top'}
              tooltip={TOOLTIPS.original} /></span>
          </BS.Col>
          <BS.Col xs={2}>
            <span className="title">Spaced Practice
            <Icon type='info-circle'
              tooltipProps={placement: 'top'}
              tooltip={TOOLTIPS.spaced} /></span>
          </BS.Col>
        </BS.Row>
        {for chapter, index in chapters
          <DashboardChapter id={chapter.id} chapter={chapter} key={index} />}
        <BS.Row>
          <BS.Col className="hide-section-legend" xs={12}>
            Chapters and sections that have not been worked are hidden
          </BS.Col>
        </BS.Row>
      </div>


    <div className="cc-dashboard" data-period={@state.activePeriodId}>
      <NotificationsBar
        course={course}
        role={course.primaryRole}
        callbacks={NotificationHelpers.buildCallbackHandlers(@)}
      />
      <CourseTitleBanner courseId={courseId} />
      <BS.Panel>
        <h2>
          <span>Class Dashboard</span>
          <TutorLink
            className='detailed-scores btn btn-default'
            to='viewScores' params={courseId: courseId}
            >
              View Detailed Scores
            </TutorLink>
        </h2>
        <CoursePeriodsNav
          handleSelect={@handlePeriodSelect}
          initialActive={@props.initialActivePeriod}
          periods={periods}
          courseId={courseId}
        />
          {if emptyPeriod then emptyGraphic else dashboardResults}
      </BS.Panel>
    </div>
module.exports = CCDashboard
