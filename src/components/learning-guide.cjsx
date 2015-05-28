React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

{CourseActions, CourseStore} = require '../flux/course'
{LearningGuideStore, LearningGuideActions} = require '../flux/learning-guide'
LoadableItem = require './loadable-item'
LearningGuideChart = require './learning-guide-chart'
PracticeButton = require './practice-button'
ChapterSection = require './task-plan/chapter-section'
ChapterSectionMixin = require './chapter-section-mixin'

LearningGuide = React.createClass
  displayName: 'LearningGuide'
  contextTypes:
    router: React.PropTypes.func

  mixins: [ChapterSectionMixin]

  propTypes:
    courseId: React.PropTypes.string.isRequired

  getInitialState: ->
    showAll: true
    footerOffset: 0
    chapter: 0
    title: ''

  navigateToPractice: (unit) ->
    {page_ids} = unit
    {courseId} = @props
    @context.router.transitionTo('viewPractice', {courseId}, {page_ids})

  displayUnit: (unit, chapter) ->
    @setState({unit, chapter: chapter})

  displayTitle: (title) ->
    @setState({title: title})

  toggleChapter: ->
    @setState({showAll: not @state.showAll}, -> @loadChart())

  displayTopic: ->
    {courseId} = @props
    if @state.showAll is false
      @setState({showAll:true}, -> @loadChart())
    else
      @context.router.transitionTo('dashboard', {courseId})

  setFooterOffset: (offsetPercent) ->
    @setState(footerOffsetPercent: offsetPercent)

  loadChart: ->
    @chart = new LearningGuideChart(@refs.svg.getDOMNode()
      LearningGuideStore.get(@props.courseId), @state.showAll, @state.chapter, @state.sectionSeparator
      {@navigateToPractice, @displayUnit, @displayTopic, @setFooterOffset, @sectionFormat, @displayTitle}
    )

  componentDidMount: ->
    @loadChart()

  render: ->
    {unit} = @state
    {overall} = @state
    if unit
      chapter = <div className='chapter'>
        {@sectionFormat(unit.chapter_section, @state.sectionSeparator)}
      </div>
      title = <div className='title'>{unit.title}</div>
      problemsWorked =
        <div className='problems-worked'>
          <div className='count'>{unit.questions_answered_count}</div>
          <div className='count-desc'>
            <b>problems worked</b>
            in readings, homeworks, and practice
          </div>
        </div>
      practiceButton =
          <PracticeButton showAll={@state.showAll} courseId={@props.courseId} pageIds={unit.page_ids}/>
      chapterToggleButton =
          <BS.Button className="chapter-button" onClick={@toggleChapter}>
            {if @state.showAll then 'Expand Chapter' else 'Back to overall'}
          </BS.Button>
      mainToggleButton =
          <BS.Button className="chapter-button" onClick={@toggleChapter}>
            {if @state.showAll then 'Expand Chapter' else 'Overall Guide'}
          </BS.Button>
      course = LearningGuideStore.get(@props.courseId)
      pathLabel = 'My Flight Path'
      chapterTitle = @state.title
      if @state.showAll
        overallLabel = ' - Overall'

    footerWidth = 600
    <div className='learning-guide-chart'>
      <div className='title-bar'>
        <div className='title'>
          <span className='span-wrap'>
            <span className='path-label'>{pathLabel}</span>
              {chapterTitle}
            <span className='overall-label'>{overallLabel}</span>
          </span>
        </div>
        <div className='button'>{if not @state.showAll then mainToggleButton}</div>
      </div>
      <svg ref='svg' />
      <div ref='footer' className='footer' style={
        left: @state.footerOffsetPercent + '%'
        width: footerWidth
        marginLeft: -1 * footerWidth * (@state.footerOffsetPercent / 100)
        }>

        <div className='header'>
          {chapter}{title}
        </div>
        <div className='body'>
          {problemsWorked}
          <div className='problems-worked-explained'>
          </div>
          {practiceButton}
          {chapterToggleButton}
        </div>

      </div>
    </div>


LearningGuideShell = React.createClass

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <div className='learning-guide'>
      <LoadableItem
        id={courseId}
        store={LearningGuideStore}
        actions={LearningGuideActions}
        renderItem={-> <LearningGuide courseId={courseId} />}
      />
    </div>

module.exports = {LearningGuideShell, LearningGuide}
