React = require 'react'
BS = require 'react-bootstrap'
{Task} = require './index'
Router = require '../../helpers/router'
LoadableItem = require '../loadable-item'
{TaskActions, TaskStore} = require '../../flux/task'
{CoursePracticeActions, CoursePracticeStore} = require '../../flux/practice'
InvalidPage = require '../invalid-page'
Icon = require '../icon'

PracticeTask = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    taskId:   React.PropTypes.string.isRequired

  render: ->
    <LoadableItem
      id={@props.taskId}
      store={TaskStore}
      actions={TaskActions}
      renderItem={=> <Task id={@props.taskId} />}
    />




LoadPractice = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.object

  componentDidMount: ->
    CoursePracticeStore.on("loaded.#{@props.courseId}", @update)
    CoursePracticeActions.create(@props.courseId, Router.currentQuery())


  componentWillUnmount: ->
    CoursePracticeStore.off("loaded.#{@props.courseId}", @update)

  update: ->
    @context.router.transitionTo(
      Router.makePathname('practiceTopics',
        courseId: @props.courseId
        taskId: CoursePracticeStore.getTaskId(@props.courseId)
      )
    )

  render: ->
    <h1><Icon type='spinner' spin /> Retrieving practice exercises…</h1>


PracticeTaskShell = React.createClass

  render: ->
    {params, query} = Router.currentState()
    if query.page_ids
      <LoadPractice courseId={params.courseId} sectionIds={query.page_ids} />
    else if params.taskId
      <PracticeTask courseId={params.courseId} taskId={params.taskId} />
    else
      <InvalidPage />

module.exports = PracticeTaskShell
