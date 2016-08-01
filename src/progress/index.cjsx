React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{ChapterSectionMixin} = require 'openstax-react-components'
{Reactive} = require '../reactive'
{ExerciseButton} = require '../buttons'
{SectionProgress} = require './section'
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
  render: ->
    {item, className, status} = @props
    {moduleUUID, collectionUUID} = @context

    chapters = item
    classes = classnames 'concept-coach-student-dashboard', className

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
      <SectionProgress title='Current Progress'>
        <CurrentProgress maxLength={maxLength}/>
      </SectionProgress>
      <SectionProgress title='Previous'>
        {progress}
      </SectionProgress>
    </div>

Progress = React.createClass
  displayName: 'Progress'
  contextTypes:
    moduleUUID:     React.PropTypes.string
  render: ->
    {id} = @props
    {moduleUUID} = @context

    <Reactive
      topic={id}
      getter={_.partial(progresses.getFilteredChapters, _, [moduleUUID])}
      store={progresses}
      apiChannelName={apiChannelName}>
      <ProgressBase/>
    </Reactive>

module.exports = {Progress, ProgressBase, channel}
