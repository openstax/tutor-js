React = require 'react'
BS = require 'react-bootstrap'
{SpyMode} = require 'shared'

LoadableItem = require '../loadable-item'
_ = require 'underscore'
S = require '../../helpers/string'

PerformanceForecast = require '../../flux/performance-forecast'
ChapterSection = require '../task-plan/chapter-section'
{ChapterSectionMixin} = require 'shared'
PerformanceForecastSection = require '../performance-forecast/section'
PerformanceForecastColorKey = require '../performance-forecast/color-key'
PracticeButton = require '../performance-forecast/practice-button'
Section = require '../performance-forecast/section'


# Number of sections to display
NUM_SECTIONS = 4

ProgressGuide = React.createClass
  displayName: 'ProgressGuide'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    sampleSizeThreshold: React.PropTypes.number.isRequired

  render: ->
    courseId = @props.courseId
    guide = PerformanceForecast.Student.store.get(courseId)
    sections = PerformanceForecast.Helpers.recentSections(
      PerformanceForecast.Student.store.getAllSections(courseId)
    )

    <div className='progress-guide'>
      <h1 className='panel-title'>Performance Forecast</h1>
      <h2 className='recent'>Recent topics</h2>
      <div className='guide-group'>
        <div className='chapter-panel'>
          {for section, i in sections
            <Section key={i} section={section} canPractice={true}
              {...@props} sampleSizeThreshold={3} />}
        </div>
      </div>
      <PerformanceForecastColorKey />
    </div>


ProgressGuidePanels = React.createClass
  contextTypes:
    router: React.PropTypes.object

  propTypes:
    courseId: React.PropTypes.string.isRequired
    sampleSizeThreshold: React.PropTypes.number.isRequired

  mixins: [ChapterSectionMixin]
  viewPerformanceForecast: ->
    @context.router.transitionTo("/courses/#{@props.courseId}/guide")

  renderEmpty: (sections) ->
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
          <SpyMode.Content>
            <ul>
              <li>{sections.length} sections were returned by the performance forecast</li>
              { for section in sections
                <li>{@sectionFormat(section.chapter_section)} section.title</li> }
            </ul>
          </SpyMode.Content>
      </div>
    </div>

  render: ->
    sections = PerformanceForecast.Student.store.getAllSections(@props.courseId)
    recent = PerformanceForecast.Helpers.recentSections(sections)
    return @renderEmpty(sections) if _.isEmpty(recent)

    practiceSections = PerformanceForecast.Helpers.weakestSections(sections)
    if _.isEmpty(practiceSections)
      practiceSections = recent

    <div className='progress-guide'>
      <div className='actions-box'>

        <ProgressGuide sections={recent} {...@props} />

        <PracticeButton ref='practiceBtn' title='Practice my weakest topics'
            courseId={@props.courseId} sections={practiceSections} />

        <BS.Button
          onClick={@viewPerformanceForecast}
          className='view-performance-forecast'
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
      store={PerformanceForecast.Student.store}
      renderLoading={@renderLoading}
      actions={PerformanceForecast.Student.actions}
      renderItem={ =>
        <ProgressGuidePanels {...@props} />}
    />
