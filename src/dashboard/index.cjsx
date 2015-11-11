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
    {item, className, status} = @props
    classes = classnames 'concept-coach-student-dashboard', className

    if status is 'loaded' and _.isEmpty(item)
      progress = <h3>Work problems to see progress</h3>
    else
      maxExercises = _.chain(item.chapters)
        .pluck('pages')
        .flatten()
        .pluck('exercises')
        .max((exercises) ->
          exercises.length
        )
        .value()


      progress = _.map item.chapters, (chapter) ->
        <ChapterProgress
          chapter={chapter}
          maxLength={maxExercises.length}
          key={"progress-chapter-#{chapter.id}"}/>

    <div className={classes}>
      {progress}
    </div>

Dashboard = React.createClass
  displayName: 'Dashboard'
  render: ->
    {id} = @props

    <Reactive id={id} store={dashboards} channelName={channelName}>
      <DashboardBase/>
    </Reactive>

module.exports = {Dashboard, DashboardBase, channel}
