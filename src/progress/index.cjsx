React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{ChapterSectionMixin} = require 'openstax-react-components'
{Reactive} = require '../reactive'
{ExerciseButton} = require '../buttons'
{ChapterProgress} = require './chapter'
{CurrentProgress} = require './current'
{channel} = progresses = require './collection'
tasks = require '../task/collection'

apiChannelName = 'courseDashboard'

ProgressBase = React.createClass
  displayName: 'ProgressBase'
  getDefaultProps: ->
    item: {}
  contextTypes:
    moduleUUID:     React.PropTypes.string
    collectionUUID: React.PropTypes.string
  mixins: [ChapterSectionMixin]
  render: ->
    {item, className, status} = @props
    {moduleUUID, collectionUUID} = @context

    classes = classnames 'concept-coach-student-dashboard', className
    chapters = _.clone(item.chapters) or []
    currentTask = tasks.get("#{collectionUUID}/#{moduleUUID}")
    maxExercises = _.chain(chapters)
      .pluck('pages')
      .flatten()
      .pluck('exercises')
      .max((exercises) ->
        exercises.length
      )
      .value()

    maxLength = Math.max(maxExercises?.length or 0, currentTask?.steps?.length or 0)

    progress = _.map chapters, (chapter) ->
      <ChapterProgress
        chapter={chapter}
        maxLength={maxLength}
        key={"progress-chapter-#{chapter.id}"}/>

    <div className={classes}>
      <CurrentProgress maxLength={maxLength}/>
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
