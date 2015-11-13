React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{Reactive} = require '../reactive'
{CourseItem} = require '../course/item'
User = require '../user/model'

apiChannelName = 'user'

DashboardBase = React.createClass
  displayName: 'DashboardBase'
  getDefaultProps: ->
    item: {}
  render: ->
    {item, className, status} = @props
    courses = _.map item.courses, (course) ->
      <CourseItem key={course.id} course={course}/>

    <div className='concept-coach-courses'>
      <h1>Enrolled Courses</h1>
      <ul className='concept-coach-courses-listing'>
        {courses}
      </ul>
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
      <DashboardBase/>
    </Reactive>

module.exports = {Dashboard, DashboardBase}
