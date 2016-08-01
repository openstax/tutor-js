React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{channel} = tasks = require '../task/collection'
{Reactive} = require '../reactive'
apiChannelName = 'task'

{ChapterProgress} = require './chapter'

CurrentProgressBase = React.createClass
  displayName: 'CurrentProgressBase'
  render: ->
    {item, taskId, maxLength, moduleUUID} = @props
    task = item
    return null unless task?.steps?

    page = tasks.getAsPage(taskId)

    chapter =
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
