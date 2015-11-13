React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{Reactive} = require '../reactive'
User = require '../user/model'

apiChannelName = 'user'

DashboardBase = React.createClass
  displayName: 'DashboardBase'
  getDefaultProps: ->
    item: {}
  render: ->
    {item, className, status} = @props
    console.info(item)
    <div className={classes}></div>

Dashboard = React.createClass
  displayName: 'Dashboard'
  render: ->
    <Reactive
      store={User}
      topic='status'
      apiChannelName={apiChannelName}
      channelUpdatePattern='change'>
      <DashboardBase/>
    </Reactive>

module.exports = {Dashboard, DashboardBase}
