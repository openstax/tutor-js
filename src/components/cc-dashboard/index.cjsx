React = require 'react'
BS = require 'react-bootstrap'

{CCDashboardStore, CCDashboardActions} = require '../../flux/cc-dashboard'
LoadableItem = require '../loadable-item'
CCDashboard = require './dashboard'

classnames = require 'classnames'


DashboardShell = React.createClass
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()

    <div className="cc-dashboard">
      <LoadableItem
        store={CCDashboardStore}
        actions={CCDashboardActions}
        id={courseId}
        renderItem={-> <CCDashboard key={courseId} id={courseId} />}
      />
    </div>

module.exports = DashboardShell
