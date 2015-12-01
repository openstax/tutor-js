React = require 'react'
BS = require 'react-bootstrap'
{CoursePeriodsNav} = require '../course-periods-nav'
{CCDashboardStore, CCDashboardActions} = require '../../flux/cc-dashboard'
{CourseStore} = require '../../flux/course'
ChapterSection = require '../task-plan/chapter-section'
LoadableItem = require '../loadable-item'
Router = require 'react-router'

DashboardSectionProgress = React.createClass
  _getPercentage: (num, total) ->
    Math.round((num / total) * 100)

  render: ->
    total = @props.section.completed + @props.section.in_progress + @props.section.not_started
    
    percents =
      completed: @_getPercentage(@props.section.completed, total)

    if percents.completed > 0
      completed = <BS.ProgressBar 
        className="reading-progress-bar" 
        bsStyle="info" 
        now={percents.completed} 
        key={1} />

    <div>
      <BS.ProgressBar className="reading-progress-group">
        {completed}
      </BS.ProgressBar>
      {percents.completed}%
    </div>

DashboardSectionPerformance = React.createClass
  render: ->
    percents =
      correct: if @props.performance then Math.round(@props.performance * 100) else 0

    percents.incorrect = 100 - percents.correct

    correctBar = if percents.correct then <BS.ProgressBar 
      className="reading-progress-bar progress-bar-correct" 
      now={percents.correct}
      key={1} />

    incorrectBar = if percents.incorrect then <BS.ProgressBar 
      className="reading-progress-bar progress-bar-incorrect" 
      now={percents.incorrect} 
      key={2} />

    <div>
      <BS.ProgressBar className="reading-progress-group">
        {correctBar}
        {incorrectBar}
      </BS.ProgressBar>
      {percents.correct}%
    </div>

DashboardSection = React.createClass
  render: ->
    <BS.Row className="section-info-row" key={@props.section.id}>
      <BS.Col xs={6}>
        <ChapterSection section={@props.section.chapter_section} />
        . {@props.section.title}
      </BS.Col>
      <BS.Col xs={2}>
        <DashboardSectionProgress section={@props.section} />
      </BS.Col>
      <BS.Col xs={2}>
        <DashboardSectionPerformance performance={@props.section.original_performance} />
      </BS.Col>
      <BS.Col xs={2}>
        <DashboardSectionPerformance performance={@props.section.spaced_practice_performance} />
      </BS.Col>
    </BS.Row>

DashboardChapter = React.createClass
  renderSection: (section, index) ->
    <DashboardSection section={section} key={index} />

  render: ->
    chapter = <BS.Row className="chapter-name-row" key={@props.chapter.id}>
      <BS.Col xs={12}>
        <ChapterSection section={@props.chapter.chapter_section} />
        . {@props.chapter.title}
      </BS.Col>
    </BS.Row>

    sections = _.map @props.chapter.pages, @renderSection
    <div>
      {chapter}
      {sections}
    </div>

DashboardBookLinks = React.createClass
  goToPdf: ->
    course = CourseStore.get(@props.courseId)
    window.open(course.book_pdf_url, 'cc-pdf-link')

  goToWebview: ->
    course = CourseStore.get(@props.courseId)
    window.open("http://cnx.org/contents/#{course.ecosystem_book_uuid}", 'cc-webview-link')

  render: ->
    <BS.Row className='dashboard-header-links'>
      <div className='pull-right'>
        <BS.Button bsStyle='link' className='link' onClick={@goToPdf}>
          Book PDF
        </BS.Button>
        <BS.Button bsStyle='link' className='link' onClick={@goToWebview}>
          Webview <i className='fa fa-external-link' />
        </BS.Button>
      </div>
    </BS.Row>
    
CCDashboard = React.createClass
  getDefaultProps: ->
    initialActivePeriod: 0

  getInitialState: ->
    activePeriod = CCDashboardStore.getPeriods(@props.id)?[@props.initialActivePeriod]
    activePeriodId: activePeriod?.id

  handlePeriodSelect: (period) ->
    @setState({activePeriodId: period.id})

  renderChapters: (chapter, index) ->
    <DashboardChapter chapter={chapter} key={index} />

  render: ->
    courseId = @props.id
    periods = CCDashboardStore.getPeriods(courseId)
    periodChapters = CCDashboardStore.getPeriodChapters(courseId, @state.activePeriodId)

    if periodChapters.length
      chapters = _.map periodChapters, @renderChapters
    else
      chapters = <div>There are no completed concept coach tasks for this period.</div>

    <BS.Panel className='reading-stats'>
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

DashboardShell = React.createClass
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()

    <div>
      <DashboardBookLinks courseId={courseId} />
      <h1>
        Class Performance
        <Router.Link className='btn btn-default pull-right' to='viewScores' params={{courseId}}>
          View Detailed Scores
        </Router.Link>
      </h1>
      <LoadableItem
        store={CCDashboardStore}
        actions={CCDashboardActions}
        id={courseId}
        renderItem={-> <CCDashboard key={courseId} id={courseId} />}
      />
    </div>

module.exports = DashboardShell

