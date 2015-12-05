React = require 'react'
BS = require 'react-bootstrap'

{CCDashboardStore} = require '../../flux/cc-dashboard'
{CoursePeriodsNav} = require '../course-periods-nav'
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
      chapters = _.map periodChapters, (chapter, index) ->
        <DashboardChapter chapter={chapter} key={index} />
    else
      chapters = <div>There are no completed concept coach tasks for this period.</div>
    courseDataProps = @getCourseDataProps(courseId)

    <BS.Panel {...courseDataProps} className='reading-stats tutor-booksplash-background'>
      <CoursePeriodsNav
        handleSelect={@handlePeriodSelect}
        initialActive={@props.initialActivePeriod}
        periods={periods}
        courseId={courseId} />

      <BS.Row className="dashboard-table-header">
        <BS.Col xs={2} xsOffset={6}>
          Complete
        </BS.Col>
        <BS.Col xs={2}>
          Original Performance
        </BS.Col>
        <BS.Col xs={2}>
          Spaced Practice Performance
        </BS.Col>
      </BS.Row>
      {chapters}
    </BS.Panel>

module.exports = CCDashboard
