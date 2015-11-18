React = require 'react'
BS = require 'react-bootstrap'
{CoursePeriodsNav} = require '../course-periods-nav'
{CCDashboardStore, CCDashboardActions} = require '../../flux/cc-dashboard'
ChapterSection = require '../task-plan/chapter-section'
LoadableItem = require '../loadable-item'

DashboardSectionProgress = React.createClass
  _getPercentage: (num, total) ->
    Math.round((num / total) * 100)

  render: ->
    total = @props.section.completed + @props.section.in_progress + @props.section.not_started
    
    percents =
      completed: @_getPercentage(@props.section.completed, total)
      inProgress: @_getPercentage(@props.section.in_progress, total)

    if percents.completed > 0
      completed = <BS.ProgressBar 
        className="reading-progress-bar" 
        bsStyle="success" 
        now={percents.completed} 
        key={1} />

    if percents.inProgress > 0
      inProgress = <BS.ProgressBar 
        className="reading-progress-bar" 
        bsStyle="info" 
        now={percents.inProgress} 
        key={2} />

    <BS.ProgressBar className="reading-progress-group">
      {completed}
      {inProgress}
    </BS.ProgressBar>

DashboardSectionPerformance = React.createClass
  render: ->
    percents =
      correct: Math.round(@props.section.original_performance * 100)

    percents.incorrect = 100 - percents.correct
    
    <BS.ProgressBar className="reading-progress-group">
      <BS.ProgressBar 
        className="reading-progress-bar progress-bar-correct" 
        now={percents.correct}
        label="#{percents.correct}%"
        key={1} />
      <BS.ProgressBar 
        className="reading-progress-bar progress-bar-incorrect" 
        now={percents.incorrect} 
        key={2} />
    </BS.ProgressBar>

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
        <DashboardSectionPerformance section={@props.section} />
      </BS.Col>
      <BS.Col xs={2}>
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

    chapters = _.map periodChapters, @renderChapters

    <BS.Panel className='reading-stats'>
      <CoursePeriodsNav
        handleSelect={@handlePeriodSelect}
        initialActive={@props.initialActivePeriod}
        periods={periods}
        courseId={courseId} />
      
      <BS.Row className="dashboard-table-header">
        <BS.Col xs={2} xsOffset={6}>
          <div>Students</div>
          <span className="progress-legend">
            Completed / In progress / Not started
          </span>
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

    <LoadableItem
      store={CCDashboardStore}
      actions={CCDashboardActions}
      id={courseId}
      renderItem={-> <CCDashboard key={courseId} id={courseId} />}
    />

module.exports = DashboardShell

