React = require 'react'
{CourseStore} = require '../../flux/course'
{StudentDashboardStore, StudentDashboardActions} = require '../../flux/student-dashboard'
LoadableItem = require '../loadable-item'
isStepComplete = (step) -> step.is_completed
StudentDashboard = require './dashboard'
WindowHelpers = require '../../helpers/window'
{NotificationActions} = require 'shared'

StudentDashboardShell = React.createClass
  displayName: 'StudentDashboardShell'

  contextTypes:
    router: React.PropTypes.func

  statics:
    # Called before the router mounts and renders the component
    # Will display the redirect screen if course is a concept coach one
    willTransitionTo: (transition, params, query, callback) ->
      {courseId} = params
      course = CourseStore.get(courseId)
      if course
        {is_concept_coach, webview_url} = course
        if is_concept_coach and webview_url
          transition.redirect('viewStudentCCRedirect', {courseId})
      else
        NotificationActions.display(message: 'That is not a valid course', icon: 'exclamation-circle')
        transition.redirect('dashboard')
      callback()

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <div className='student-dashboard '>
      <LoadableItem
        id={courseId}
        store={StudentDashboardStore}
        actions={StudentDashboardActions}
        renderItem={ -> <StudentDashboard courseId={courseId}/> }
      />
    </div>

module.exports = {StudentDashboardShell}
