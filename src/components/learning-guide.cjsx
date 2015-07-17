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

  render: ->
    {courseId} = @props
    linkParams = {courseId}
    guide = LearningGuideStore.get(@props.courseId)
    chapters = _.map(guide.children, @renderChapterPanels)

    allSections = LearningGuideStore.getSortedSections(@props.courseId)
    # if there are less than 4 sections, use 1/2 of the available ones
    weakStrongCount = Math.min(allSections.length / 2, 4)

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
            <div>
              {for section, i in _.first(allSections, weakStrongCount)
                <Section key={i} section={section} courseId={courseId} />}
            </div>
          </div>
          <div className="chapter-panel expanded">
            <div className='chapter-heading metric'>
              Stronger
            </div>
            <div>
              {for section, i in _.last(allSections, weakStrongCount)
                <Section key={i} section={section} courseId={courseId} />}
            </div>
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
