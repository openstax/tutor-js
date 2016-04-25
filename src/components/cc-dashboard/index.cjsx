React = require 'react'
BS = require 'react-bootstrap'

{CCDashboardStore, CCDashboardActions} = require '../../flux/cc-dashboard'
LoadableItem = require '../loadable-item'
CCDashboard = require './dashboard'
BlankCourse = require './blank-course'
classnames = require 'classnames'


DashboardShell = React.createClass
  contextTypes:
    router: React.PropTypes.func
    params: React.PropTypes.object

  onLoadComplete: ->
    {courseId} = @context.params
    if CCDashboardStore.isBlank(courseId)
      <BlankCourse courseId={courseId}/>
    else
      <CCDashboard key={courseId} courseId={courseId} />

  render: ->
    {courseId} = @context.params
    <div className="cc-dashboard">
      <LoadableItem
        store={CCDashboardStore}
        actions={CCDashboardActions}
        id={courseId}
        renderItem={@onLoadComplete}
      />
    </div>

module.exports = DashboardShell
