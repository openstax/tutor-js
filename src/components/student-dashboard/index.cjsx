React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{StudentDashboardStore, StudentDashboardActions} = require '../../flux/student-dashboard'
LoadableItem = require '../loadable-item'
moment = require 'moment'
isStepComplete = (step) -> step.is_completed
StudentDashboard = require './dashboard'

StudentDashboardShell = React.createClass
  displayName: 'StudentDashboardShell'

  contextTypes:
    router: React.PropTypes.func

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
