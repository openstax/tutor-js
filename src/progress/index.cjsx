React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{ChapterSectionMixin} = require 'openstax-react-components'
{Reactive} = require '../reactive'
{ExerciseButton} = require '../buttons'
{ChapterProgress} = require './chapter'
{channel} = progresses = require './collection'

apiChannelName = 'courseDashboard'

ProgressBase = React.createClass
  displayName: 'ProgressBase'
  getDefaultProps: ->
    item: {}
  mixins: [ChapterSectionMixin]
  render: ->
    {item, className, status} = @props
    classes = classnames 'concept-coach-student-dashboard', className

    if status is 'loaded' and _.isEmpty(item?.chapters)
      progress = <div>
        <h3>Exercise to see progress</h3>
        <ExerciseButton/>
      </div>
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

Progress = React.createClass
  displayName: 'Progress'
  render: ->
    {id} = @props

    <Reactive topic={id} store={progresses} apiChannelName={apiChannelName}>
      <ProgressBase/>
    </Reactive>

module.exports = {Progress, ProgressBase, channel}
