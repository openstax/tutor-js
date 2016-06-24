_ = require 'underscore'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{TaskPlanStore} = require './task-plan'

TeacherTaskPlanConfig =

  # The load returns a JSON containing `{total_count: 0, items: [...]}`.
  # Unwrap the JSON and store the items.
  _loaded: (obj, id) ->
    {plans} = obj

    @_local[id] ?= []
    newPlanIds = _.pluck(plans, 'id')

    uniqueOldPlans = _.reject(@_local[id], (plan) ->
      _.contains(newPlanIds, plan.id)
    )

    _.union(uniqueOldPlans, plans)

  exports:
    getPlanId: (courseId, planId) ->
      _.findWhere(@_local[courseId], id: planId)

    getActiveCoursePlans: (id) ->
      plans = @_local[id] or []
      # don't return plans that are in the process of being deleted
      _.filter plans, (plan) ->
        not TaskPlanStore.isDeleteRequested(plan.id)


extendConfig(TeacherTaskPlanConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TeacherTaskPlanConfig)
module.exports = {TeacherTaskPlanActions:actions, TeacherTaskPlanStore:store}
