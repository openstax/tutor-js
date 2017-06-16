React = require 'react'
{HomeworkPlan} = require './homework'
{ReadingPlan} = require './reading'
{ExternalPlan} = require './external'
{EventPlan} = require './event'
LoadableItem = require '../loadable-item'
{CourseStore, CourseActions} = require '../../flux/course'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
Router = require '../../helpers/router'
{ default: TourRegion } = require '../tours/region'

{ScrollToMixin} = require 'shared'

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
    router: React.PropTypes.object

  render: ->
    {courseId, id} = Router.currentParams()
    <PlanShell courseId={courseId} id={id} type='homework'/>

ReadingShell = React.createClass
  displayName: 'ReadingShell'
  contextTypes:
    router: React.PropTypes.object

  render: ->
    {courseId, id} = Router.currentParams()
    <PlanShell courseId={courseId} id={id} type='reading'/>

ExternalShell = React.createClass
  displayName: 'ExternalShell'
  contextTypes:
    router: React.PropTypes.object

  render: ->
    {courseId, id} = Router.currentParams()
    <PlanShell courseId={courseId} id={id} type='external'/>

EventShell = React.createClass
  displayName: 'EventShell'
  contextTypes:
    router: React.PropTypes.object

  render: ->
    {courseId, id} = Router.currentParams()
    <PlanShell courseId={courseId} id={id} type='event'/>

PlanBuilder = ({ id, courseId, body: Body, type }) ->
  <TourRegion
    id={"#{type}-assignment-editor"}
    otherTours={["#{type}-assignment-editor-super"]}
    courseId={courseId}
  >
    <Body id={id} courseId={courseId} />
  </TourRegion>


PlanShell = React.createClass
  displayName: 'PlanShell'

  mixins: [ScrollToMixin]

  contextTypes:
    router: React.PropTypes.object

  componentDidMount:  -> @scrollToTop()

  getInitialState: ->
    {id} = Router.currentParams()
    type = @props.type
    if not getPlanType(type)
      @context.router.transitionTo(Router.makePathname('NotFoundRoute'))
      return

    if not id or id is 'new'
      id = TaskPlanStore.freshLocalId()
      TaskPlanActions.create(id, {type})

    {id}

  getId: -> @state.id or Router.currentParams().id

  getType: ->
    typeName = @props.type
    getPlanType(typeName)

  render: ->
    {courseId} = Router.currentParams()
    id = @getId()

    if TaskPlanStore.isDeleteRequested(id)
      return <Type id={id} courseId={courseId} />

    <LoadableItem
      id={id}
      store={TaskPlanStore}
      actions={TaskPlanActions}
      renderItem={=>
        <PlanBuilder type={@props.type} body={@getType()} id={id} courseId={courseId} />
      }
    />

module.exports = {ReadingShell, HomeworkShell, ExternalShell, EventShell}
