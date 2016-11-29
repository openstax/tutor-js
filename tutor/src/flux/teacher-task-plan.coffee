_ = require 'underscore'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{TaskPlanStore} = require './task-plan'
map = require 'lodash/map'

addPlan = (plan, plans, existingPlanIds) ->
  existingPlanIds ?= _.pluck(plans, 'id')
  planIndex = _.indexOf(existingPlanIds, plan.id)

  if planIndex > -1
    plans[planIndex] = plan
  else
    plans.push(plan)

TeacherTaskPlanConfig =
  _ranges: {}

  # The load returns a JSON containing `{total_count: 0, items: [...]}`.
  # Unwrap the JSON and store the items.
  _loaded: (obj, courseId, startAt, endAt) ->
    {plans} = obj

    @_local[courseId] ?= []
    existingPlanIds = _.pluck(@_local[courseId], 'id')

    _.each(plans, _.partial(addPlan, _, @_local[courseId], existingPlanIds))

    @_ranges[courseId] ?= {}
    @_ranges[courseId]["#{startAt}-#{endAt}"] = true
    @_local[courseId]

  _reset: ->
    @_ranges = {}

  addClonedPlan: (courseId, planId) ->
    plan = TaskPlanStore.get(planId)
    @_local[courseId].push(plan)
    @emitChange()

  removeClonedPlan: (courseId, planId) ->
    plans = @_local[courseId]
    indx = _.findIndex(plans, (plan) -> plan.id is planId)
    if indx isnt -1
      plans.splice(indx, 1)
      @emitChange()

  addPublishingPlan: (plan, courseId) ->
    return unless @_local[courseId]?
    addPlan(plan, @_local[courseId])
    @emitChange()

  exports:
    getPlanId: (courseId, planId) ->
      _.findWhere(@_local[courseId], id: planId)

    getActiveCoursePlans: (id) ->
      plans = @_local[id] or []
      # don't return plans that are in the process of being deleted
      _.filter plans, (plan) ->
        not TaskPlanStore.isDeleteRequested(plan.id)

    isLoadingRange: (id, startAt, endAt) ->
      not @_ranges[id]?["#{startAt}-#{endAt}"]

extendConfig(TeacherTaskPlanConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TeacherTaskPlanConfig)
module.exports = {TeacherTaskPlanActions:actions, TeacherTaskPlanStore:store}
