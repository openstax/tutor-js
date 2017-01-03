{makeStandardStore} = require './helpers'
TaskPlanHelper = require '../helpers/task-plan'

isEmpty = require 'lodash/isEmpty'
sortBy  = require 'lodash/sortBy'
reject = require 'lodash/reject'

StoreDefinition = makeStandardStore('PastTaskPlans', {
  _loaded: (data, courseId) ->
    data.items

  unload: (courseId, planId) ->
    newItems = reject(@_get(courseId), {id: planId})
    @loaded({items: newItems}, courseId)

  exports:
    byDueDate: (courseId) ->
      sortBy(@_get(courseId), TaskPlanHelper.earliestDueDate)

    hasPlans: (courseId) ->
      not isEmpty(@_get(courseId))
})

module.exports = StoreDefinition
