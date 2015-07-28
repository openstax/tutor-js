_ = require 'underscore'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TeacherTaskPlanConfig =

  # The load returns a JSON containing `{total_count: 0, items: [...]}`.
  # Unwrap the JSON and store the items.
  _loaded: (obj, id) ->
    {plans} = obj
    @_local[id] = plans

  exports:
    getActiveCoursePlans: (id) ->
      plans = @_local[id] or []
      # don't return plans that are in the process of being deleted
      _.filter plans, (plan) =>
        not @exports.isDeleting.call(@, plan.id)


extendConfig(TeacherTaskPlanConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TeacherTaskPlanConfig)
module.exports = {TeacherTaskPlanActions:actions, TeacherTaskPlanStore:store}
