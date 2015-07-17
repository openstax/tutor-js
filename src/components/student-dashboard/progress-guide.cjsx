React = require 'react'
BS = require 'react-bootstrap'
LoadableItem = require '../loadable-item'
_ = require 'underscore'
S = require '../../helpers/string'

{LearningGuideStore, LearningGuideActions} = require '../../flux/learning-guide'
ChapterSection = require '../task-plan/chapter-section'
ChapterSectionMixin = require '../chapter-section-mixin'
LearningGuideSection = require '../learning-guide/section'
LearningGuideColorKey = require '../learning-guide/color-key'

ProgressGuide = React.createClass
  displayName: 'ProgressGuide'

  propTypes:
    courseId: React.PropTypes.string.isRequired

  mixins: [ChapterSectionMixin]

  getRecentChapters: (chapter, i) ->
#    sections = _.map(chapter.children, @renderSectionBars)
    <div key={i}>{for section, si in chapter.children
      <LearningGuideSection key={"#{i}.#{si}"} section={section} courseId={@props.courseId} />}
    </div>


  _percent: (num, total) ->
    Math.round((num / total) * 100)

  renderSectionBars: (section) ->

    chapterSection =
      @sectionFormat(section.chapter_section, @state.sectionSeparator)
    sectionPercent = @_percent(section.current_level, 1)
    colorClass = @colorizeBar(sectionPercent)
    <div key={chapterSection} className='section'>
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
    recentTopics = _.map(guide.children[0..4], @getRecentChapters)
    <div className='progress-guide'>
      <h1 className='panel-title'>Recent Topics</h1>
      <h2 className='current'>Current Level of Understanding</h2>
      <div className='guide-group'>
        <div className='chapter-panel'>
        {recentTopics}
        </div>
      </div>
      <LearningGuideColorKey />
    </div>

PracticeButton = React.createClass
  propTypes:
    courseId: React.PropTypes.string.isRequired
    practiceType: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  onClick: ->
    {courseId} = @props
    all = LearningGuideStore.getSortedSections(@props.courseId)
    sections = if @props.practiceType is 'weaker' then _.first(all, 4) else _.last(all, 4)
    page_ids = _.chain(sections).pluck('page_ids').flatten().uniq().value()
    @context.router.transitionTo('viewPractice', {courseId}, {page_ids})

  render: ->
    <BS.Button className={@props.practiceType} onClick={@onClick}>
      {S.capitalize(@props.practiceType)}
      <i />
    </BS.Button>


ProgressGuidePanels = React.createClass
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired

  viewGuide: ->
    @context.router.transitionTo('viewGuide', {courseId: @props.courseId})

  render: ->
    <div className='progress-guide'>

      <div className='actions-box'>
        <h1 className='panel-title'>Practice</h1>
        <BS.ButtonGroup>
          <PracticeButton practiceType='stronger' courseId={@props.courseId} />
          <PracticeButton practiceType='weaker'   courseId={@props.courseId} />
        </BS.ButtonGroup>
      </div>

      <div className='actions-box'>
        <ProgressGuide courseId={@props.courseId} />
        <BS.Button
          onClick={@viewGuide}
          className='view-learning-guide'
        >
          View All Topics
        </BS.Button>
      </div>
  </div>

module.exports = React.createClass
  displayName: 'ProgressGuideShell'

  propTypes:
    courseId: React.PropTypes.string.isRequired

  renderLoading: (refreshButton) ->
    <div className='actions-box loadable is-loading'>
      Loading progress information... {refreshButton}
    </div>

  render: ->
    <LoadableItem
      id={@props.courseId}
      store={LearningGuideStore}
      renderLoading={@renderLoading}
      actions={LearningGuideActions}
      renderItem={=> <ProgressGuidePanels {...@props} />}
    />
