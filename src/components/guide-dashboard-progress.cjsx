React = require 'react'
BS = require 'react-bootstrap'
LoadableItem = require './loadable-item'
_ = require 'underscore'

{CourseActions, CourseStore} = require '../flux/course'
{LearningGuideStore, LearningGuideActions} = require '../flux/learning-guide'
ChapterSection = require './task-plan/chapter-section'
ChapterSectionMixin = require './chapter-section-mixin'

GuideDashboardProgress = React.createClass
  displayName: 'GuideDashboardProgress'

  propTypes:
    courseId: React.PropTypes.string.isRequired

  mixins: [ChapterSectionMixin]

  getRecentChapters: (chapter, i) ->
    sections = _.map(chapter.children, @renderSectionBars)
    <div>{sections}</div>

  _percent: (num, total) ->
    Math.round((num / total) * 100)

  renderSectionBars: (section) ->
    chapterSection =
      @sectionFormat(section.chapter_section, @state.sectionSeparator)
    sectionPercent = @_percent(section.current_level, 1)
    colorClass = @colorizeBar(sectionPercent)
    <div className='section'>
      <div className='section-heading'>
        <span className='section-number'>{chapterSection}</span>
        <span className='section-title' title={section.title}>{section.title}</span>
      </div>
      <BS.ProgressBar className={colorClass} now={sectionPercent} />
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
    recentTopics = _.map(guide.children, @getRecentChapters)
    console.log(guide)
    console.log(@props)
    <div className='dashboard-container'>
      <span className='heading lg'>Practice</span>
      <span className='heading md'>Current Level of Understanding</span>
      <span className='heading sm'>Recent Topics</span>
      <div className='guide-group'>
        <div className='chapter-panel'>
        {recentTopics}
        </div>
      </div>
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
    </div>


GuideDashboardProgressShell = React.createClass

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string

  getCourseId: ->
    {courseId} = @props
    {courseId} = @context.router.getCurrentParams() unless courseId?

    courseId

  render: ->
    courseId = @getCourseId()
    <div className='learning-guide'>
      <LoadableItem
        id={courseId}
        store={LearningGuideStore}
        actions={LearningGuideActions}
        renderItem={=> <GuideDashboardProgress {...@props} courseId={courseId} />}
      />
    </div>

module.exports = {GuideDashboardProgressShell, GuideDashboardProgress}
