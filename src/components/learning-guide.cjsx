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
    {courseId} = @props
    linkParams = {courseId}
    queryParams = {page_ids: section.page_ids}
    chapterSection =
      @sectionFormat(section.chapter_section, @state.sectionSeparator)
    sectionPercent = @_percent(section.current_level, 1)
    colorClass = @colorizeBar(sectionPercent)
    <div className='section'>
      <div className='section-heading'>
        <span className='section-number'>{chapterSection}</span>
        <span className='section-title' title={section.title}>{section.title}</span>
      </div>
      <Router.Link
      to='viewPractice'
      params={linkParams}
      query={queryParams}
      title="Click to Practice"
      className='btn btn-default progress-bar-button'>
        <BS.ProgressBar className={colorClass} now={sectionPercent} />
      </Router.Link>
      <div className='amount-worked'>
        <span className='count'>{section.questions_answered_count} worked</span>
      </div>
    </div>


  renderChapterPanels: (chapter, i) ->
    {courseId} = @props
    linkParams = {courseId}
    queryParams = {page_ids: chapter.page_ids}
    sections = _.map(chapter.children, @renderSectionBars)
    chapterPercent = @_percent(chapter.current_level, 1)
    colorClass = @colorizeBar(chapterPercent)

    <BS.Col lg={4} md={4} sm={6} xs={12}>
      <div className="chapter-panel">
        <div className='view-toggle' onClick={@onToggle.bind(@, i)}>
          View All
        </div>
        <div className='chapter-heading'>
          <span className='chapter-number'>{chapter.chapter_section[0]}</span>
          <div className='chapter-title' title={chapter.title}>{chapter.title}</div>
        <Router.Link
        to='viewPractice'
        params={linkParams}
        query={queryParams}
        title="Click to Practice"
        className='btn btn-default progress-bar-button'>
          <BS.ProgressBar className={colorClass} now={chapterPercent} />
        </Router.Link>
        <div className='amount-worked'>
          <span className='count'>{chapter.questions_answered_count} worked</span>
        </div>
        </div>
        <div>{sections}</div>
      </div>
    </BS.Col>


  onToggle: (index, event) ->
    el = event.target.parentNode
    if el.classList.contains('expanded')
      el.classList.remove('expanded')
      event.target.innerHTML = 'View All'
    else
      el.classList.add('expanded')
      event.target.innerHTML = 'View Less'


  colorizeBar: (percent) ->
    if percent > 75
      'high'
    else if percent <= 75 and percent >= 50
      'medium'
    else if percent <= 49
      'low'

  render: ->
    {courseId} = @props
    linkParams = {courseId}
    guide = LearningGuideStore.get(@props.courseId)
    chapters = _.map(guide.children, @renderChapterPanels)

    allSections = []
    sections = guide.children
    for section in sections
      allSections.push(section.children)
    allSections = _.flatten(allSections)

    sortBest = _.sortBy(allSections, 'current_level')
    sortBest = sortBest.reverse()[0...4]
    sortWorst = _.sortBy(allSections, 'current_level')
    sortWorst = sortWorst[0...4]

    bestPages = _.flatten(_.pluck(sortBest, 'page_ids'))
    worstPages = _.flatten(_.pluck(sortWorst, 'page_ids'))

    weaker = _.map(sortWorst, @renderSectionBars)
    stronger = _.map(sortBest, @renderSectionBars)

    <div className='guide-container'>

      <div className='guide-heading'>
        <span className='guide-group-title'>Current Level of Understanding</span>
        <Router.Link
        to='dashboard'
        params={linkParams}
        className='btn btn-default header-button'>
          Return to Dashboard
        </Router.Link>
      </div>

      <div className='guide-group'>
        <BS.Col mdPull={0} xs={12} md={9}>
          {chapters}
        </BS.Col>
        <BS.Col mdPush={0} xs={12} md={3}>
          <div className="chapter-panel expanded">
            <div className='chapter-heading metric'>
              Weaker
            </div>
            <div>{weaker}</div>
            <Router.Link
            to='viewPractice'
            params={linkParams}
            query={page_ids: worstPages}
            className='btn btn-default metric-button'>
              Practice Weaker
            </Router.Link>
          </div>
          <div className="chapter-panel expanded">
            <div className='chapter-heading metric'>
              Stronger
            </div>
            <div>{stronger}</div>
            <Router.Link
            to='viewPractice'
            params={linkParams}
            query={page_ids: bestPages}
            className='btn btn-default metric-button'>
              Practice Stronger
            </Router.Link>
          </div>
        </BS.Col>
      </div>


      <div className='guide-footer'>
        <div className='guide-key'>
          Click on the bar to practice the topic
        </div>
        <div className='guide-key'>
          <div className='item'>
            <div className='box high'></div>
            <span className='title'>looking good</span>
          </div>
          <div className='item'>
            <div className='box medium'></div>
            <span className='title'>almost there</span>
          </div>
          <div className='item'>
            <div className='box low'></div>
            <span className='title'>keep trying</span>
          </div>
        </div>
      </div>

    </div>


LearningGuideShell = React.createClass

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <BS.Panel className='learning-guide main'>
      <LoadableItem
        id={courseId}
        store={LearningGuideStore}
        actions={LearningGuideActions}
        renderItem={-> <LearningGuide courseId={courseId} />}
      />
    </BS.Panel>

module.exports = {LearningGuideShell, LearningGuide}
