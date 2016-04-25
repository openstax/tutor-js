React = require 'react'
{HomeworkPlan} = require './homework'
{ReadingPlan} = require './reading'
{ExternalPlan} = require './external'
{EventPlan} = require './event'
LoadableItem = require '../loadable-item'
{CourseStore, CourseActions} = require '../../flux/course'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'

PLAN_TYPES =
  reading: ReadingPlan
  homework: HomeworkPlan
  external: ExternalPlan
  event: EventPlan

getPlanType = (typeName) ->
  type = PLAN_TYPES[typeName]

HomeworkShell = React.createClass
  displayName: 'HomeworkShell'
  contextTypes:
    router: React.PropTypes.func
    params: React.PropTypes.object

  render: ->
    {courseId, id} = @context.params
    <PlanShell courseId={courseId} id={id} type='homework'/>

ReadingShell = React.createClass
  displayName: 'ReadingShell'
  contextTypes:
    router: React.PropTypes.func
    params: React.PropTypes.object

  render: ->
    {courseId, id} = @context.params
    <PlanShell courseId={courseId} id={id} type='reading'/>

ExternalShell = React.createClass
  displayName: 'ExternalShell'
  contextTypes:
    router: React.PropTypes.func
    params: React.PropTypes.object

  render: ->
    {courseId, id} = @context.params
    <PlanShell courseId={courseId} id={id} type='external'/>

EventShell = React.createClass
  displayName: 'EventShell'
  contextTypes:
    router: React.PropTypes.func
    params: React.PropTypes.object

  render: ->
    {courseId, id} = @context.params
    <PlanShell courseId={courseId} id={id} type='event'/>

PlanShell = React.createClass
  displayName: 'PlanShell'

  contextTypes:
    router: React.PropTypes.func
    params: React.PropTypes.object

  getInitialState: ->
    {courseId, id} = @context.params
    type = @props.type
    if not getPlanType(type)
      @context.router.push('/404')
      return

    if not id
      id = TaskPlanStore.freshLocalId()
      TaskPlanActions.create(id, {
        _HACK_courseId: courseId
        type: type
      })
    {id}

  getId: -> @context.params.id or @state.id

  getType: ->
    typeName = @props.type
    getPlanType(typeName)

  getFlux: ->
    store: TaskPlanStore
    actions: TaskPlanActions

  render: ->
    Type = @getType()
    {courseId} = @context.params
    id = @getId()

    if TaskPlanStore.isDeleteRequested(id)
      return <Type id={id} courseId={courseId} />

    <LoadableItem
      id={id}
      store={TaskPlanStore}
      actions={TaskPlanActions}
      renderItem={-> <Type id={id} courseId={courseId} />}
    />

module.exports = {ReadingShell, HomeworkShell, ExternalShell, EventShell}
