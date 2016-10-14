React = require 'react'
BS = require 'react-bootstrap'

Router = require '../../helpers/router'
{CCDashboardStore, CCDashboardActions} = require '../../flux/cc-dashboard'
LoadableItem = require '../loadable-item'
CCDashboard = require './dashboard'
CCDashboardHelp = require './help'
classnames = require 'classnames'


DashboardShell = React.createClass

  onLoadComplete: ->
    {courseId} = Router.currentParams()
    if CCDashboardStore.isBlank(courseId)
      <CCDashboardHelp courseId={courseId}/>
    else
      <CCDashboard key={courseId} courseId={courseId} />

  render: ->
    {courseId} = Router.currentParams()
    <LoadableItem
      store={CCDashboardStore}
      actions={CCDashboardActions}
      id={courseId}
      renderItem={@onLoadComplete}
    />

module.exports = DashboardShell
