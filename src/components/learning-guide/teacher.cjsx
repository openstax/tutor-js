React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

{CoursePeriodsNavShell} = require '../course-periods-nav'

LearningGuide = require '../../flux/learning-guide'

Guide = require './guide'
ColorKey    = require './color-key'
InfoLink    = require './info-link'

module.exports = React.createClass
  displayName: 'LearningGuideTeacherDisplay'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId:  React.PropTypes.string.isRequired

  getInitialState: ->
    periods = LearningGuide.Teacher.store.get(@props.courseId)
    periodId: _.first(periods)?.period_id

  selectPeriod: (period) ->
    @setState(periodId: period.id)

  renderHeading: ->
    periods = LearningGuide.Teacher.store.get(@props.courseId)
    <BS.Row>
      <BS.Col xs=12>
        <BS.Panel className='guide-heading'>
          <div className='guide-group-title'>
            Performance Forecast <InfoLink type='teacher'/>
          </div>
          <div className='info'>
            <div className='guide-group-key teacher'>
              <ColorKey />
            </div>
            <Router.Link activeClassName='' to='viewTeacherDashBoard'
              className='btn btn-default pull-right'
              params={courseId: @props.courseId}>
              Return to Dashboard
            </Router.Link>
          </div>
        </BS.Panel>
      </BS.Col>
      <CoursePeriodsNavShell
        periods={periods}
        handleSelect={@selectPeriod}
        intialActive={@state.periodId}
        courseId={@props.courseId} />
    </BS.Row>



  renderEmptyMessage: ->
    <div className="no-data-message">There have been no questions worked for this period.</div>

  returnToDashboard: ->
    @context.router.transitionTo('viewTeacherDashBoard', {courseId: @props.courseId})

  renderWeakerExplanation: ->
    <div className='explanation'>
      <p>Tutor shows the weakest topics for each period.</p>
      <p>Students may need your help in those areas.</p>
    </div>

  render: ->
    {courseId} = @props
    <BS.Panel className='learning-guide teacher'>
      <Guide
        courseId={courseId}
        weakerTitle="Weaker Areas"
        heading={@renderHeading()}
        weakerExplanation={@renderWeakerExplanation()}
        emptyMessage={@renderEmptyMessage()}
        onReturn={@returnToDashboard}
        allSections={LearningGuide.Teacher.store.getSectionsForPeriod(courseId, @state.periodId)}
        chapters={LearningGuide.Teacher.store.getChaptersForPeriod(courseId, @state.periodId)}
      />
    </BS.Panel>
