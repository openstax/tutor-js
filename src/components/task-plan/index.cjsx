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

PlanShell = React.createClass
  mixins: [ConfirmLeaveMixin]

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    {courseId, type, id} = @context.router.getCurrentParams()

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
    id = @getId()
    typeName = @context.router.getCurrentParams().type
    getPlanType(typeName)

  getFlux: ->
    store: TaskPlanStore
    actions: TaskPlanActions

  # If, as a result of a save creating a new object (and providing an id)
  # then transition to editing the object
  update: ->
    id = @getId()
    if TaskPlanStore.isNew(id) and TaskPlanStore.get(id).id
      {id, type} = TaskPlanStore.get(id)
      {courseId} = @context.router.getCurrentParams()
      @setState({id})
    else
      @setState({})

  render: ->
    id = @getId()
    {courseId} = @context.router.getCurrentParams()
    Type = @getType()

    <LoadableItem
      id={id}
      store={TaskPlanStore}
      actions={TaskPlanActions}
      update={@update}
      renderItem={-> <Type id={id} courseId={courseId} />}
    />

module.exports = {PlanShell, ReadingPlan, HomeworkPlan}
