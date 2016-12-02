{makeStandardStore} = require './helpers'
isEmpty = require 'lodash/isEmpty'
reject = require 'lodash/reject'

StoreDefinition = makeStandardStore('PastTaskPlans', {
  _loaded: (data, courseId) ->
    data.items

  unload: (courseId, planId) ->
    newItems = reject(@_get(courseId), {id: planId})
    @loaded({items: newItems}, courseId)

  exports:
    hasPlans: (courseId) ->
      not isEmpty(@_get(courseId))
})

module.exports = StoreDefinition
