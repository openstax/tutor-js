_ = require 'underscore'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

CREATE_KEY = "CREATING"

TaskPlanConfig =
  _getPlan: (planId) ->
    @_local[planId]?.topics = [] if (@_local[planId] and !@_local[planId].topics) #TODO take out once TaskPlan api is in place
    @_local[planId]

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
    plan.topics.push(topicId) unless plan.topics?.indexOf(topicId) >= 0
    @emitChange()

  removeTopic: (id, topicId) ->
    plan = @_getPlan(id)

    index = plan.topics?.indexOf(topicId)
    plan.topics.splice(index, 1)
    @emitChange()

  create: (due_at = null) ->
    @_local[CREATE_KEY] = {
      due_at: due_at
    }

  created: (result, id) ->
    @_asyncStatus[id] = CREATED
    @_local[id] = result

  exports:
    hasTopic: (id, topicId) ->
      plan = @_getPlan(id)
      plan?.topics?.indexOf(topicId) >= 0
    getCreateKey: -> CREATE_KEY
    getTopics: (id) ->
      plan = @_getPlan(id)
      plan?.topics


extendConfig(TaskPlanConfig, CrudConfig)
{actions, store} = makeSimpleStore(TaskPlanConfig)
module.exports = {TaskPlanActions:actions, TaskPlanStore:store}
