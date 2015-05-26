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

  navigateToPractice: (unit) ->
    {page_ids} = unit
    {courseId} = @props
    @context.router.transitionTo('viewPractice', {courseId}, {page_ids})

  displayUnit: (unit, chapter) ->
    @setState({unit, chapter: chapter})

  displayChapter: ->
    if @state.showAll
      @setState({showAll:false}, -> @loadChart())

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
      {@navigateToPractice, @displayUnit, @displayTopic, @setFooterOffset, @sectionFormat}
    )

  componentDidMount: ->
    @loadChart()

  render: ->
    {unit} = @state
    if unit
      chapter = <div className='chapter'>
        {@sectionFormat(unit.chapter_section, @state.sectionSeparator)}
      </div>
      title = <div className='title'>{unit.title}</div>
      problemsWorked =
        <div className='problems-worked'>
          <div className='count'>{unit.questions_answered_count}</div>
          <div className='count-desc'>problems worked</div>
        </div>
      practiceButton =
        <div className='practice-button-wrap'>
          <PracticeButton courseId={@props.courseId} pageIds={unit.page_ids}>Practice</PracticeButton>
        </div>
      chapterButton =
        <div className='chapter-button-wrap'>
          <BS.Button className="chapter-button" bsStyle='primary' onClick={@displayChapter}>
            View This Chapter
          </BS.Button>
        </div>
      helpText =
        <div className='help-text'>
          Total problems you have done in readings, homeworks and practice
        </div>
    footerWidth = 600
    <div className='learning-guide-chart'>
      <svg ref='svg' />
      <div ref='footer' className='footer' style={
        left: @state.footerOffsetPercent + '%'
        width: footerWidth
        marginLeft: -1 * footerWidth * (@state.footerOffsetPercent / 100)
        }>
        <div ref='footer-content-wrap' className='footer-content-wrap'>
          <div className='header'>
            {chapter}{title}
          </div>
          <div className='row-wrap'>
            {problemsWorked}
            {practiceButton}
            {if @state.showAll then chapterButton}
          </div>
          {helpText}
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
