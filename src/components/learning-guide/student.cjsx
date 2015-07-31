React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

LearningGuide = require '../../flux/learning-guide'

Guide = require './guide'
ColorKey    = require './color-key'

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
      <div className='guide-group-title'>Performance Forecast</div>

      <div className='pull-right'>


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

  render: ->
    {courseId} = @props
    <BS.Panel className='learning-guide student'>
      <Guide
        onPractice={@onPractice}
        courseId={courseId}
        weakerTitle="My weakest topics"
        heading={@renderHeading()}
        emptyMessage={@renderEmptyMessage()}
        onReturn={@returnToDashboard}
        allSections={LearningGuide.Student.store.getAllSections(courseId)}
        chapters={LearningGuide.Student.store.get(courseId).children}
      />
    </BS.Panel>
