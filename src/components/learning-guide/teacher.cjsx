React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

{CoursePeriodsNavShell} = require '../course-periods-nav'

{LearningGuideTeacherStore} = require '../../flux/learning-guide-teacher'

Guide = require './guide'

module.exports = React.createClass
  displayName: 'LearningGuideTeacherDisplay'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId:  React.PropTypes.string.isRequired

  getInitialState: ->
    periods = LearningGuideTeacherStore.get(@props.courseId)
    periodId: _.first(periods)?.period_id

  selectPeriod: (period) ->
    @setState(periodId: period.id)

  renderTabs: ->
    periods = LearningGuideTeacherStore.get(@props.courseId)
    <div className='guide-heading'>
      <CoursePeriodsNavShell
        periods={periods}
        handleSelect={@selectPeriod}
        intialActive={@state.periodId}
        courseId={@props.courseId} />
    </div>

  render: ->
    {courseId} = @props
    <BS.Panel className='learning-guide main teacher'>
      <Guide
        courseId={courseId}
        heading={@renderTabs()}
        allSections={LearningGuideTeacherStore.getSectionsForPeriod(courseId, @state.periodId)}
        chapters={LearningGuideTeacherStore.getChaptersForPeriod(courseId, @state.periodId)}
      />
    </BS.Panel>
