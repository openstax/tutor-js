_ = require 'underscore'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'


TaskPlanConfig =
  _getPlan: (planId) ->
    @_local[planId] ?= {}
    @_local[planId].settings ?= {}
    @_local[planId].settings.page_ids ?= []
    #TODO take out once TaskPlan api is in place
    _.extend({}, @_local[planId], @_changed[planId])

  FAILED: ->

  updateTitle: (id, title) ->
    @_change(id, {title})

  updateOpensAt: (id, opens_at) ->
    # Allow null opens_at
    if opens_at
      opens_at = opens_at.toISOString()
    @_change(id, {opens_at})

  updateDueAt: (id, due_at) ->
    # Allow null due_at
    if due_at
      due_at = due_at.toISOString()
    @_change(id, {due_at})

  addTopic: (id, topicId) ->
    plan = @_getPlan(id)
    {page_ids} = plan.settings
    page_ids = page_ids[..] # Copy the page_ids so we can reset it back if clearChanged() is called

    page_ids.push(topicId) unless plan.settings.page_ids.indexOf(topicId) >= 0

    @_change(id, {settings: {page_ids}})

  removeTopic: (id, topicId) ->
    plan = @_getPlan(id)
    {page_ids} = plan.settings
    page_ids = page_ids[..] # Copy the page_ids so we can reset it back if clearChanged() is called

    index = page_ids?.indexOf(topicId)
    page_ids?.splice(index, 1)

    @_change(id, {settings : {page_ids}})

  publish: (id) ->

  exports:
    hasTopic: (id, topicId) ->
      plan = @_getPlan(id)
      plan?.settings.page_ids?.indexOf(topicId) >= 0
    getTopics: (id) ->
      plan = @_getPlan(id)
      plan?.settings.page_ids
    isValid: (id) ->
      plan = @_getPlan(id)
      plan.title and plan.opens_at and plan.due_at and plan.settings?.page_ids?.length > 0
    isPublished: (id) ->
      plan = @_getPlan(id)
      !!plan?.published_at

extendConfig(TaskPlanConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskPlanConfig)
module.exports = {TaskPlanActions:actions, TaskPlanStore:store}
