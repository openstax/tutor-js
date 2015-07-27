React = require 'react'
BS = require 'react-bootstrap'
LoadableItem = require '../loadable-item'
_ = require 'underscore'
S = require '../../helpers/string'

LearningGuide = require '../../flux/learning-guide'
ChapterSection = require '../task-plan/chapter-section'
ChapterSectionMixin = require '../chapter-section-mixin'
LearningGuideSection = require '../learning-guide/section'
LearningGuideColorKey = require '../learning-guide/color-key'
PracticeButtonsPanel = require './practice-buttons'

# Number of sections to display
NUM_SECTIONS = 4

ProgressGuide = React.createClass
  displayName: 'ProgressGuide'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired

  onPractice: (section) ->
    @context.router.transitionTo('viewPractice', {courseId: @props.courseId}, {page_ids: section.page_ids})

  render: ->
    courseId = @props.courseId
    guide = LearningGuide.Student.store.get(courseId)

    sections = for section, i in _.first(LearningGuide.Student.store.getAllSections(courseId), NUM_SECTIONS)
      <LearningGuideSection key={i}
        section={section}
        onPractice={@onPractice}
        courseId={courseId} />

    <div className='progress-guide'>
      <h1 className='panel-title'>Recent Topics</h1>
      <h2 className='current'>Current Level of Understanding</h2>
      <div className='guide-group'>
        <div className='chapter-panel'>
        {_.first(sections, 4)}
        </div>
      </div>
      <LearningGuideColorKey />
    </div>


ProgressGuidePanels = React.createClass
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired

  viewGuide: ->
    @context.router.transitionTo('viewGuide', {courseId: @props.courseId})

  render: ->
    <div className='progress-guide'>

      <PracticeButtonsPanel courseId={@props.courseId} />

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
      store={LearningGuide.Student.store}
      renderLoading={@renderLoading}
      actions={LearningGuide.Student.actions}
      renderItem={=> <ProgressGuidePanels {...@props} />}
    />
