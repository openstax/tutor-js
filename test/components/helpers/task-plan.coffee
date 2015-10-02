_ = require 'underscore'
{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{Testing} = require '../helpers/component-testing'

tomorrow = (new Date(Date.now() + 1000 * 3600 * 24)).toString()
dayAfter = (new Date(tomorrow + 1000 * 3600 * 24)).toString()

ExtendBasePlan = (props, taskingProps = {}, extendTasking = true) ->
  baseModel =
    id: '111'
    title: 'Test Title'
    settings:
      page_ids: ['1']

  baseTaskingPlan =
    opens_at: tomorrow
    due_at: dayAfter
    target_type: 'period'

  baseModel = _.extend({}, baseModel, props)

  if taskingProps? and extendTasking
    baseTaskingPlan = _.extend({}, baseTaskingPlan, taskingProps)

    baseModel.tasking_plans = []
    baseModel.tasking_plans.push(baseTaskingPlan)

  baseModel

PlanRenderHelper = (model, component, moreProps = {}, routerParams, routerQuery) ->
  {id} = model
  # Load the plan into the store
  TaskPlanActions.loaded(model, id)
  props = _.extend({id, courseId: "1"}, moreProps)
  Testing.renderComponent( component, props: props, routerParams: routerParams, routerQuery: routerQuery)

module.exports = {ExtendBasePlan, PlanRenderHelper}
