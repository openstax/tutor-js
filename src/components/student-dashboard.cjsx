React = require 'react'
BS = require 'react-bootstrap'
{StudentDashboardStore, StudentDashboardActions} = require '../flux/student-dashboard'
LoadableItem = require './loadable-item'

StudentDashboard = React.createClass
  displayName: 'StudentDashboard'

  contextTypes:
    router: React.PropTypes.func

  renderDashBoard: (courseId)->
    courseInfo = StudentDashboardStore.get(courseId)
    <BS.PageHeader>{courseInfo.title}</BS.PageHeader>

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <BS.Panel className="student-dashboard">
      <LoadableItem
        id={courseId}
        store={StudentDashboardStore}
        actions={StudentDashboardActions}
        renderItem={=>@renderDashBoard(courseId)}
      />
    </BS.Panel>

module.exports = {StudentDashboard}
