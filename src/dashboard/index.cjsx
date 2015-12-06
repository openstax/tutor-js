React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{Reactive} = require '../reactive'
{CourseListing} = require '../course/listing'
User = require '../user/model'

apiChannelName = 'user'

DashboardBase = React.createClass
  displayName: 'DashboardBase'
  getDefaultProps: ->
    item: {}
  render: ->
    {item, status, cnxUrl} = @props

    <div className='concept-coach-courses'>
      <h1>Enrolled Courses</h1>
      <CourseListing
        courses={item.courses}/>
    </div>

Dashboard = React.createClass
  displayName: 'Dashboard'
  render: ->
    <Reactive
      store={User}
      topic='status'
      fetcher={User.ensureStatusLoaded.bind(User)}
      apiChannelName={apiChannelName}
      channelUpdatePattern='change'>
      <DashboardBase cnxUrl={@props.cnxUrl}/>
    </Reactive>

module.exports = {Dashboard, DashboardBase}
