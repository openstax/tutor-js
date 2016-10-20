React = require 'react'
BS = require 'react-bootstrap'
{Task} = require './index'
Router = require '../../helpers/router'
LoadableItem = require '../loadable-item'
{TaskActions, TaskStore} = require '../../flux/task'
{CoursePracticeActions, CoursePracticeStore} = require '../../flux/practice'

PracticeTask = React.createClass

  componentWillMount: ->
    CoursePracticeStore.on("loaded.#{@getId()}", @update)
    @createPractice(@getId())

  componentWillUnmount: ->
    CoursePracticeStore.off("loaded.#{@getId()}", @update)

  createPractice: (courseId) ->
    query = Router.currentQuery()
    CoursePracticeActions.create(courseId, query)

  getInitialState: ->
    # force a new practice each time
    taskId: null

  getId: ->
    {courseId} = Router.currentParams()
    courseId

  update: ->
    @setState({
      taskId:  CoursePracticeStore.getTaskId(@getId())
    })

  render: ->
    <LoadableItem
      id={@state.taskId}
      store={TaskStore}
      actions={TaskActions}
      renderItem={=> <Task key={@state.taskId} id={@state.taskId} />}
    />

module.exports = PracticeTask
