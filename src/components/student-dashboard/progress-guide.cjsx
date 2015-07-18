React = require 'react'
BS = require 'react-bootstrap'
LoadableItem = require '../loadable-item'
_ = require 'underscore'
S = require '../../helpers/string'

{LearningGuideStudentStore, LearningGuideStudentActions} = require '../../flux/learning-guide-student'
ChapterSection = require '../task-plan/chapter-section'
ChapterSectionMixin = require '../chapter-section-mixin'
LearningGuideSection = require '../learning-guide/section'
LearningGuideColorKey = require '../learning-guide/color-key'

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
    guide = LearningGuideStudentStore.get(courseId)

    sections = for section, i in _.first(LearningGuideStudentStore.getAllSections(courseId), NUM_SECTIONS)
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

PracticeButton = React.createClass
  propTypes:
    courseId: React.PropTypes.string.isRequired
    practiceType: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  onClick: ->
    {courseId} = @props
    all = LearningGuideStudentStore.getSortedSections(@props.courseId)
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
      store={LearningGuideStudentStore}
      renderLoading={@renderLoading}
      actions={LearningGuideStudentActions}
      renderItem={=> <ProgressGuidePanels {...@props} />}
    />
