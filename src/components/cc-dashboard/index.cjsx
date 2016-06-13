React = require 'react'
BS = require 'react-bootstrap'

{CCDashboardStore, CCDashboardActions} = require '../../flux/cc-dashboard'
LoadableItem = require '../loadable-item'
CCDashboard = require './dashboard'
CCDashboardHelp = require './help'
classnames = require 'classnames'


DashboardShell = React.createClass
  contextTypes:
    router: React.PropTypes.func

  onLoadComplete: ->
    {courseId} = @context.router.getCurrentParams()
    if CCDashboardStore.isBlank(courseId)
      <CCDashboardHelp courseId={courseId}/>
    else
      <CCDashboard key={courseId} courseId={courseId} />

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <LoadableItem
      store={CCDashboardStore}
      actions={CCDashboardActions}
      id={courseId}
      renderItem={@onLoadComplete}
    />

module.exports = DashboardShell
