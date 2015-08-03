React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

LearningGuide = require '../../flux/learning-guide'

Guide = require './guide'
ColorKey    = require './color-key'
InfoLink    = require './info-link'

module.exports = React.createClass
  displayName: 'LearningGuideStudentDisplay'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId:  React.PropTypes.string.isRequired

  onPractice: (section) ->
    @context.router.transitionTo('viewPractice', {courseId: @props.courseId}, {page_ids: section.page_ids})

  returnToDashboard: ->
    @context.router.transitionTo('viewStudentDashboard', {courseId: @props.courseId})

  renderHeading: ->
    <BS.Panel className='guide-heading'>
      <div className='guide-group-title'>
        Performance Forecast <InfoLink type='student'/>
      </div>

      <div className='info'>
        <div className='guide-group-key'>
          <div className='guide-key'>
            Click on the bar to practice the topic
          </div>
          <ColorKey />
        </div>

        <Router.Link to='viewStudentDashboard' className='btn btn-default pull-right'
        params={courseId: @props.courseId}>
        Return to Dashboard
        </Router.Link>

      </div>
    </BS.Panel>

  renderEmptyMessage: ->
    <div>You have not worked any questions yet.</div>

  renderWeakerExplanation: ->
    <div className='explanation'>
      <p>Tutor shows your weakest topics so you can practice to improve.</p>
      <p>Try to get all of your topics to green!</p>
    </div>

  render: ->
    {courseId} = @props
    <BS.Panel className='learning-guide student'>
      <Guide
        onPractice={@onPractice}
        courseId={courseId}
        weakerTitle="My Weaker Areas"
        weakerExplanation={@renderWeakerExplanation()}
        heading={@renderHeading()}
        emptyMessage={@renderEmptyMessage()}
        onReturn={@returnToDashboard}
        allSections={LearningGuide.Student.store.getAllSections(courseId)}
        chapters={LearningGuide.Student.store.get(courseId).children}
      />
    </BS.Panel>
