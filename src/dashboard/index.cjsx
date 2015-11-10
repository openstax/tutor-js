React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{Reactive} = require '../reactive'
{channel} = dashboards = require './collection'

channelName = 'courseDashboard'

DashboardBase = React.createClass
  displayName: 'DashboardBase'
  getDefaultProps: ->
    item: {}
  render: ->
    {item, className} = @props

    classes = classnames 'concept-coach-student-dashboard', className

    chapters = _.map(item.chapters, (chapter) ->
      <p>{chapter.title}</p>
    )

    <div className={classes}>
      {chapters}
    </div>

Dashboard = React.createClass
  displayName: 'Dashboard'
  render: ->
    {id} = @props

    <Reactive id={id} store={dashboards} channelName={channelName}>
      <DashboardBase/>
    </Reactive>

module.exports = {Dashboard, DashboardBase, channel}
