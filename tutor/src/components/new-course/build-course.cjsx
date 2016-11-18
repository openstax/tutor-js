React = require 'react'
BS = require 'react-bootstrap'
Icon = require '../icon'
TutorLink = require '../link'
{NewCourseActions, NewCourseStore} = require '../../flux/new-course'

BuildCourse = React.createClass
  displayName: 'BuildCourse'
  statics:
    shouldHideControls: true

  componentWillMount: ->
    NewCourseActions.save()

  renderSaved: (newCourse) ->
    <div>
      <h4>Your new course is ready!</h4>
      Click <TutorLink
        to={if newCourse.is_concept_coach then 'ccDashboardHelp' else 'dashboard'}
        params={courseId: newCourse.id}
      > here to start using it.</TutorLink>
    </div>

  renderPending: ->
    <div>
      <h4>We’re building your Tutor course…</h4>
      <p>Should take about 10 seconds</p>
      <div className="text-center">
        <Icon type='refresh' spin className="fa-5x" />
      </div>
    </div>

  render: ->
    newCourse = NewCourseStore.newCourse()
    if newCourse
      @renderSaved(newCourse)
    else
      @renderPending()


module.exports = BuildCourse
