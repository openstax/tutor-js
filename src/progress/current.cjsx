React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{channel} = tasks = require '../task/collection'
{Reactive} = require '../reactive'
apiChannelName = 'task'

{ChapterProgress} = require './chapter'

CurrentProgressBase = React.createClass
  displayName: 'CurrentProgressBase'
  getInitialState: ->
    {item} = @props

    task: item

  componentWillReceiveProps: (nextProps) ->
    nextState =
      task: nextProps.item

    @setState(nextState)

  render: ->
    {task} = @state
    {taskId, maxLength, moduleUUID} = @props
    return null unless task?

    page = _.pick task, 'last_worked_at', 'id'
    _.extend page, _.first(_.first(task.steps).related_content)
    page.exercises = task.steps
    page.uuid = moduleUUID

    chapter =
      title: 'Current'
      pages: [page]

    <ChapterProgress
      className='current'
      chapter={chapter}
      maxLength={maxLength}
      key={"progress-chapter-current"}/>

CurrentProgress = React.createClass
  displayName: 'CurrentProgress'

  contextTypes:
    moduleUUID:     React.PropTypes.string
    collectionUUID: React.PropTypes.string

  filter: (props, eventData) ->
    toCompare = ['collectionUUID', 'moduleUUID']

    setProps = _.pick(props, toCompare)
    receivedData = _.pick(eventData.data, toCompare)

    _.isEqual(setProps, receivedData)

  render: ->
    {collectionUUID, moduleUUID} = @context
    taskId = "#{collectionUUID}/#{moduleUUID}"

    <Reactive
      topic={taskId}
      store={tasks}
      apiChannelName={apiChannelName}
      collectionUUID={collectionUUID}
      moduleUUID={moduleUUID}
      fetcher={tasks.fetchByModule}
      filter={@filter}>
      <CurrentProgressBase {...@context} {...@props} taskId={taskId}/>
    </Reactive>

module.exports = {CurrentProgress}
