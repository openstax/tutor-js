React = require 'react'
BS = require 'react-bootstrap'
Icon = require '../icon'
TutorLink = require '../link'
{NewCourseActions, NewCourseStore} = require '../../flux/new-course'

BindStoreMixin = require '../bind-store-mixin'
Router = require '../../helpers/router'

BuildCourse = React.createClass
  displayName: 'BuildCourse'
  statics:
    title: 'Creating your new course'
    Footer: ->
      <span />
  componentWillMount: ->
    NewCourseActions.save()

  contextTypes:
    router: React.PropTypes.object

  mixins: [BindStoreMixin]
  bindStore: NewCourseStore
  bindEvent: 'created'
  bindUpdate: ->
    newCourse = NewCourseStore.newCourse()
    @redirectToCourse(newCourse) if newCourse

  redirectToCourse: (course) ->
    to = if course.is_concept_coach then 'ccDashboardHelp' else 'dashboard'
    @context.router.transitionTo(Router.makePathname(
      to, {courseId: course.id}, query: {showIntro: 'true'}
    ))

  render: ->
    <div>
      <h4>We’re building your Tutor course…</h4>
      <p>Should take about 10 seconds</p>
    </div>

module.exports = BuildCourse
