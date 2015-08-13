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
PracticeButton = require '../learning-guide/practice-button'
WeakerSections = require '../learning-guide/weaker-sections'

# Number of sections to display
NUM_SECTIONS = 4

ProgressGuide = React.createClass
  displayName: 'ProgressGuide'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired
    sampleSizeThreshold: React.PropTypes.number.isRequired

  onPractice: (section) ->
    @context.router.transitionTo('viewPractice', {courseId: @props.courseId}, {page_ids: section.page_ids})

  render: ->
    courseId = @props.courseId
    guide = LearningGuide.Student.store.get(courseId)

    <div className='progress-guide'>
      <h1 className='panel-title'>Performance Forecast</h1>
      <h2 className='recent'>Recent topics</h2>
      <div className='guide-group'>
        <div className='chapter-panel'>
        <WeakerSections {...@props}
          onPractice={@onPractice}
          sections={LearningGuide.Student.store.getAllSections(courseId)}
          weakerEmptyMessage="You haven't worked enough problems for Tutor to predict your weakest topics."
        />
        </div>
      </div>
      <LearningGuideColorKey />
    </div>


ProgressGuidePanels = React.createClass
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.string.isRequired
    sampleSizeThreshold: React.PropTypes.number.isRequired

  viewGuide: ->
    @context.router.transitionTo('viewGuide', {courseId: @props.courseId})

  renderEmpty: ->
    <div className='progress-guide empty'>
      <div className='actions-box'>
        <h1 className='panel-title'>Performance Forecast</h1>
          <p>
            The performance forecast is an estimate of your current understanding of a topic.
            It is a personalized display based on your answers to reading questions,
            homework problems, and previous practices.
          </p><p>
            This area will fill in with topics as you complete your assignments
          </p>
      </div>
    </div>

  render: ->
    return @renderEmpty() unless LearningGuide.Helpers.canPractice({
      @props, sections:LearningGuide.Student.store.getAllSections(@props.courseId)
    })

    sections = LearningGuide.Helpers.weakestSections(
      LearningGuide.Student.store.getAllSections(@props.courseId), @props.sampleSizeThreshold
    )

    <div className='progress-guide'>
      <div className='actions-box'>

        <ProgressGuide {...@props} />

        <PracticeButton title='Practice my weakest topics'
          {...@props} sections={sections} />

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
    sampleSizeThreshold: React.PropTypes.number.isRequired

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
