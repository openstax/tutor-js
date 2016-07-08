React = require 'react'
{CourseStore} = require '../../flux/course'
{StudentDashboardStore, StudentDashboardActions} = require '../../flux/student-dashboard'
LoadableItem = require '../loadable-item'
isStepComplete = (step) -> step.is_completed
StudentDashboard = require './dashboard'
WindowHelpers = require '../../helpers/window'

StudentDashboardShell = React.createClass
  displayName: 'StudentDashboardShell'

  contextTypes:
    router: React.PropTypes.func

  componentWillMount: ->
    {courseId} = @context.router.getCurrentParams()
    {is_concept_coach, webview_url} = CourseStore.get(courseId)

    if is_concept_coach and webview_url
      WindowHelpers.replaceBrowserLocation(webview_url)

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
