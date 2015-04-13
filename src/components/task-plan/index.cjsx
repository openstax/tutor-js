React = require 'react'
ConfirmLeaveMixin = require '../confirm-leave-mixin'
{HomeworkPlan} = require './homework'
{ReadingPlan} = require './reading'
LoadableItem = require '../loadable-item'

{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'

PLAN_TYPES =
  reading: ReadingPlan
  homework: HomeworkPlan

getPlanType = (typeName) ->
  type = PLAN_TYPES[typeName]

HomeworkShell = React.createClass
  displayName: 'HomeworkShell'
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId, id} = @context.router.getCurrentParams()
    <PlanShell courseId={courseId} id={id} type="homework"/>

ReadingShell = React.createClass
  displayName: 'ReadingShell'
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId, id} = @context.router.getCurrentParams()
    <PlanShell courseId={courseId} id={id} type="reading"/>

PlanShell = React.createClass
  displayName: 'PlanShell'

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    {courseId, id} = @context.router.getCurrentParams()
    type = @props.type
    if not getPlanType(type)
      @context.router.transitionTo('NotFoundRoute')
      return

    if (id)
      TaskPlanActions.load(id)
    else
      id = TaskPlanStore.freshLocalId()
      TaskPlanActions.create(id, {
        _HACK_courseId: courseId
        type: type
      })
    {id}

  getId: -> @context.router.getCurrentParams().id or @state.id

  getType: ->
    typeName = @props.type
    getPlanType(typeName)

  getFlux: ->
    store: TaskPlanStore
    actions: TaskPlanActions

  # If, as a result of a save creating a new object (and providing an id)
  # then transition to editing the object
  saved: ->
    id = @getId()
    {id, type} = TaskPlanStore.get(id)
    {courseId} = @context.router.getCurrentParams()
    if type is "homework"
      @context.router.transitionTo('editHomework', {courseId, id})
    else if type is "reading"
      @context.router.transitionTo('editReading', {courseId, id})

  render: ->
    id = @getId()
    {courseId} = @context.router.getCurrentParams()
    Type = @getType()

    <LoadableItem
      id={id}
      store={TaskPlanStore}
      actions={TaskPlanActions}
      saved={@saved}
      renderItem={-> <Type id={id} courseId={courseId} />}
    />

module.exports = {ReadingShell, HomeworkShell}
