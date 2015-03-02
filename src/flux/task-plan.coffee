_ = require 'underscore'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TaskPlanConfig =
  _getPlan: (planId) -> @_local[planId]

  updateTitle: (id, title) ->
    plan = @_getPlan(id)
    _.extend(plan, {title})
    @emitChange()

  updateDueAt: (id, due_at) ->
    plan = @_getPlan(id)
    _.extend(plan, {due_at})
    @emitChange()

  addTopic: (id, topicId) ->
    plan = @_getPlan(id)
    plan.topics.push(topicId) unless plan.topics.indexOf(topicId) >= 0
    @emitChange()

  removeTopic: (id, topicId) ->
    plan = @_getPlan(id)
    @emitChange()


extendConfig(TaskPlanConfig, CrudConfig)
{actions, store} = makeSimpleStore(TaskPlanConfig)
module.exports = {TaskPlanActions:actions, TaskPlanStore:store}
