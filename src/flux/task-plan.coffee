_ = require 'underscore'
moment = require 'moment'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

CREATE_KEY = "CREATING"

TaskPlanConfig =
  _getPlan: (planId) ->
    @_local[planId] ?= {}
    @_local[planId].settings ?= {}
    @_local[planId].settings.page_ids ?= []
    #TODO take out once TaskPlan api is in place
    @_local[planId]

  FAILED: ->

  updateTitle: (id, title) ->
    plan = @_getPlan(id)
    _.extend(plan, {title})
    @emitChange()

  updateDueAt: (id, due_at=new moment()) ->
    plan = @_getPlan(id)
    _.extend(plan, {due_at: due_at.toISOString()})
    @emitChange()

  addTopic: (id, topicId) ->
    plan = @_getPlan(id)
    plan.settings.page_ids.push(topicId) unless plan.settings.page_ids.indexOf(topicId) >= 0
    @emitChange()

  removeTopic: (id, topicId) ->
    plan = @_getPlan(id)

    index = plan.settings.page_ids?.indexOf(topicId)
    plan.settings.page_ids?.splice(index, 1)
    @emitChange()

  publish: (id) ->

  create: (due_at = new moment()) ->
    @_local[CREATE_KEY] = {
      due_at: due_at
    }

  created: (result, id) ->
    @_local[CREATE_KEY] = result.id # HACK to give react component the id
    @_local[result.id] = result
    @emitChange()

  exports:
    hasTopic: (id, topicId) ->
      plan = @_getPlan(id)
      plan?.settings.page_ids?.indexOf(topicId) >= 0
    getCreateKey: -> CREATE_KEY
    getTopics: (id) ->
      plan = @_getPlan(id)
      plan?.settings.page_ids


extendConfig(TaskPlanConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskPlanConfig)
module.exports = {TaskPlanActions:actions, TaskPlanStore:store}
