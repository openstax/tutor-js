React = require 'react'
BS = require 'react-bootstrap'
{SpyMode} = require 'shared'
Router = require '../../helpers/router'
LoadableItem = require '../../components/loadable-item'
_ = require 'underscore'
S = require '../../helpers/string'

PerformanceForecast = require '../../flux/performance-forecast'
ChapterSection = require '../../components/task-plan/chapter-section'
{ChapterSectionMixin} = require 'shared'
PerformanceForecastSection = require '../../components/performance-forecast/section'
PerformanceForecastColorKey = require '../../components/performance-forecast/color-key'
PracticeButton = require '../../components/performance-forecast/practice-button'
Section = require '../../components/performance-forecast/section'
{default: PracticeWeakestButton} = require '../../components/performance-forecast/weakest-practice-button'

# Number of sections to display
NUM_SECTIONS = 4

ProgressGuide = React.createClass
  displayName: 'ProgressGuide'

  propTypes:
    courseId: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]).isRequired

  render: ->
    courseId = @props.courseId
    guide = PerformanceForecast.Student.store.get(courseId)
    sections = PerformanceForecast.Helpers.recentSections(
      PerformanceForecast.Student.store.getAllSections(courseId)
    )

    <div className='progress-guide'>
      <h2 className='panel-title'>Performance Forecast</h2>
      <h3 className='recent'>Recent topics</h3>
      <div className='guide-group'>
        <div className='chapter-panel'>
          {for section, i in sections
            <Section key={i} section={section} canPractice={true}
              {...@props} />}
        </div>
      </div>
      <PerformanceForecastColorKey />
    </div>


ProgressGuidePanels = React.createClass
  contextTypes:
    router: React.PropTypes.object

  propTypes:
    courseId: React.PropTypes.string.isRequired

  mixins: [ChapterSectionMixin]
  viewPerformanceForecast: ->
    @context.router.history.push(
      Router.makePathname('viewPerformanceGuide', @props)
    )

  renderEmpty: (sections) ->
    <div className='progress-guide panel empty'>
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

    <div className='progress-guide panel'>
      <div className='actions-box'>

        <ProgressGuide sections={recent} {...@props} />

        <PracticeWeakestButton courseId={@props.courseId} />

        <BS.Button
          role="link"
          onClick={@viewPerformanceForecast}
          className='view-performance-forecast'
          role='link'
        >
          View All Topics
        </BS.Button>

      </div>
  </div>

module.exports = React.createClass
  displayName: 'ProgressGuideShell'

  propTypes:
    courseId: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]).isRequired

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
