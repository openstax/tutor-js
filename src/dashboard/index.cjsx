React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{ChapterSectionMixin} = require 'openstax-react-components'
{Reactive} = require '../reactive'
{ChapterProgress} = require '../progress'
{channel} = dashboards = require './collection'

channelName = 'courseDashboard'

DashboardBase = React.createClass
  displayName: 'DashboardBase'
  getDefaultProps: ->
    item: {}
  mixins: [ChapterSectionMixin]
  render: ->
    {item, className} = @props

    classes = classnames 'concept-coach-student-dashboard', className

    chapters = _.map(item.chapters, (chapter) ->
      <ChapterProgress chapter={chapter} key={"progress-chapter-#{chapter.id}"}/>
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
