React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

{CoursePeriodsNavShell} = require '../course-periods-nav'

LearningGuide = require '../../flux/learning-guide'

Guide = require './guide'
ColorKey    = require './color-key'

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
    <div>
      <BS.Panel className='guide-heading'>
        <div className='guide-group-title'>Performance Forecast</div>
        <div className='pull-right'>
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
      <CoursePeriodsNavShell
      periods={periods}
      handleSelect={@selectPeriod}
      intialActive={@state.periodId}
      courseId={@props.courseId} />
    </div>



  renderEmptyMessage: ->
    <div>No questions worked.</div>

  returnToDashboard: ->
    @context.router.transitionTo('viewTeacherDashBoard', {courseId: @props.courseId})

  render: ->
    {courseId} = @props
    <BS.Panel className='learning-guide teacher'>
      <Guide
        courseId={courseId}
        weakerTitle="Weaker Areas"
        heading={@renderHeading()}
        emptyMessage={@renderEmptyMessage()}
        onReturn={@returnToDashboard}
        allSections={LearningGuide.Teacher.store.getSectionsForPeriod(courseId, @state.periodId)}
        chapters={LearningGuide.Teacher.store.getChaptersForPeriod(courseId, @state.periodId)}
      />
    </BS.Panel>
