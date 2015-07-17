React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

{CourseActions, CourseStore} = require '../flux/course'
{LearningGuideStore, LearningGuideActions} = require '../flux/learning-guide'
LoadableItem = require './loadable-item'
PracticeButton = require './buttons/practice-button'
ChapterSection = require './task-plan/chapter-section'

Chapter = require './learning-guide/chapter'
Section = require './learning-guide/section'
ColorKey = require './learning-guide/color-key'
ProgressBar = require './learning-guide/progress-bar'

LearningGuide = React.createClass
  displayName: 'LearningGuide'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired

  renderChapterPanels: (chapter, i) ->
    <BS.Col key={i} lg={4} md={4} sm={6} xs={12}>
      <Chapter chapter={chapter} courseId={@props.courseId} />
    </BS.Col>

  renderWeaker: (chapter, i) ->
    {courseId} = @props
    for section, si in chapter.children
      <Section key={"#{i}.#{si}"} section={section} courseId={courseId} />

  renderStronger: (chapter, i) ->
    {courseId} = @props
    for section, si in chapter.children
      <Section key={"#{i}.#{si}"} section={section} courseId={courseId} />

  render: ->
    {courseId} = @props
    linkParams = {courseId}
    guide = LearningGuideStore.get(@props.courseId)
    chapters = _.map(guide.children, @renderChapterPanels)
    weaker   = _.map(guide.children, @renderWeaker)
    stronger = _.map(guide.children, @renderStronger)

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
        <ColorKey />

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
