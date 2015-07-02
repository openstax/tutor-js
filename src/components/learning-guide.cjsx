React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

{CourseActions, CourseStore} = require '../flux/course'
{LearningGuideStore, LearningGuideActions} = require '../flux/learning-guide'
LoadableItem = require './loadable-item'
PracticeButton = require './buttons/practice-button'
ChapterSection = require './task-plan/chapter-section'
ChapterSectionMixin = require './chapter-section-mixin'

LearningGuide = React.createClass
  displayName: 'LearningGuide'
  contextTypes:
    router: React.PropTypes.func

  mixins: [ChapterSectionMixin]

  propTypes:
    courseId: React.PropTypes.string.isRequired


  _percent: (num, total) ->
    Math.round((num / total) * 100)

  renderSectionBars: (section) ->
    chapterSection =
      @sectionFormat(section.chapter_section, @state.sectionSeparator)
    sectionPercent = @_percent(section.current_level, 1)
    colorClass = @colorizeBar(sectionPercent)
    <div className='section'>
      <i className='icon-guide icon-homework'></i>
      <div className='section-heading'>
        <span className='section-number'>{chapterSection}</span>
        <span className='section-title' title={section.title}>{section.title}</span>
      </div>
      <BS.ProgressBar className={colorClass} now={sectionPercent} />
    </div>


  renderChapterPanels: (chapter, i) ->
    sections = _.map(chapter.children, @renderSectionBars)
    chapterPercent = @_percent(chapter.current_level, 1)
    colorClass = @colorizeBar(chapterPercent)
    <div className='chapter-panel'>
      <div className='chapter-heading'>
        <i className='icon-guide icon-homework'></i>
        <span className='chapter-number'>{chapter.chapter_section[0]}</span>
        <div className='chapter-title' title={chapter.title}>{chapter.title}</div>
        <BS.ProgressBar className={colorClass} now={chapterPercent} />
      </div>
      <div>{sections}</div>
    </div>

  colorizeBar: (percent) ->
    if percent > 75
      'high'
    else if percent <= 75 and percent >= 50
      'medium'
    else if percent <= 49
      'low'

  render: ->
    guide = LearningGuideStore.get(@props.courseId)
    chapters = _.map(guide.children, @renderChapterPanels)

    <div className='guide-container'>
      <span className='guide-group-title'>Learning Guide</span>
      <div className='guide-key'>
        <div className='item'>
          <div className='box high'></div>
          <span className='title'>Good</span>
        </div>
        <div className='item'>
          <div className='box medium'></div>
          <span className='title'>OK</span>
        </div>
        <div className='item'>
          <div className='box low'></div>
          <span className='title'>Needs work</span>
        </div>
      </div>
      
      <BS.Panel className='guide-group'></BS.Panel>

      <span className='guide-group-title'>Individual Chapters</span>
      <BS.Panel className='guide-group'>{chapters}</BS.Panel>
    </div>


LearningGuideShell = React.createClass

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <BS.Panel className='learning-guide'>
      <LoadableItem
        id={courseId}
        store={LearningGuideStore}
        actions={LearningGuideActions}
        renderItem={-> <LearningGuide courseId={courseId} />}
      />
    </BS.Panel>

module.exports = {LearningGuideShell, LearningGuide}
