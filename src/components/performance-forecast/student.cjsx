React = require 'react'
BS = require 'react-bootstrap'
{ Link } = require 'react-router'
_ = require 'underscore'

PerformanceForecast = require '../../flux/performance-forecast'

Guide = require './guide'
ColorKey    = require './color-key'
InfoLink    = require './info-link'

module.exports = React.createClass
  displayName: 'PerformanceForecastStudentDisplay'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId:  React.PropTypes.string.isRequired

  onPractice: (section) ->
    @context.router.transitionTo('viewPractice', {courseId: @props.courseId}, {page_ids: section.page_ids})

  returnToDashboard: ->
    @context.router.transitionTo('viewStudentDashboard', {courseId: @props.courseId})

  renderHeading: ->
    <div className='guide-heading'>
      <div className='guide-group-title'>
        Performance Forecast <InfoLink type='student'/>
      </div>

      <div className='info'>
        <div className='guide-group-key'>
          <div className='guide-practice-message'>
            Click on the bar to practice the topic
          </div>
          <ColorKey />
        </div>

        <Link to="/courses/#{@props.courseId}/list/?" className='btn btn-default back'>
        Return to Dashboard
        </Link>

      </div>
    </div>

  renderEmptyMessage: ->
    <div className="no-data-message">You have not worked any questions yet.</div>

  renderWeakerExplanation: ->
    <div className='explanation'>
      <p>Tutor shows your weakest topics so you can practice to improve.</p>
      <p>Try to get all of your topics to green!</p>
    </div>

  render: ->
    {courseId} = @props
    <BS.Panel className='performance-forecast student'>
      <Guide
        onPractice={@onPractice}
        courseId={courseId}
        weakerTitle="My Weaker Areas"
        weakerExplanation={@renderWeakerExplanation()}
        weakerEmptyMessage="You haven't worked enough problems for Tutor to predict your weakest topics."
        heading={@renderHeading()}
        sampleSizeThreshold={3}
        emptyMessage={@renderEmptyMessage()}
        onReturn={@returnToDashboard}
        allSections={PerformanceForecast.Student.store.getAllSections(courseId)}
        chapters={PerformanceForecast.Student.store.get(courseId).children}
      />
    </BS.Panel>
