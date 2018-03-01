React = require 'react'
BS = require 'react-bootstrap'
BackButton = require('../buttons/back-button')
Router = require('../../helpers/router')
_ = require 'underscore'

PerformanceForecast = require '../../flux/performance-forecast'

Guide = require './guide'
ColorKey    = require './color-key'
InfoLink    = require './info-link'

module.exports = React.createClass
  displayName: 'PerformanceForecastStudentDisplay'
  propTypes:
    courseId:  React.PropTypes.string.isRequired

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
        <BackButton
          fallbackLink={{ to: 'dashboard', text: 'Back to Dashboard', params: Router.currentParams() }}
        />
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
        canPractice={true}
        courseId={courseId}
        weakerTitle="My Weaker Areas"
        weakerExplanation={@renderWeakerExplanation()}
        weakerEmptyMessage="You haven't worked enough problems for Tutor to predict your weakest topics."
        heading={@renderHeading()}
        emptyMessage={@renderEmptyMessage()}
        allSections={PerformanceForecast.Student.store.getAllSections(courseId)}
        chapters={PerformanceForecast.Student.store.get(courseId).children}
      />
    </BS.Panel>
