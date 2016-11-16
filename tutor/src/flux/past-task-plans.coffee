{makeStandardStore, STATES} = require './helpers'
cloneDeep = require 'lodash/cloneDeep'

BLANK = {}

StoreDefinition = makeStandardStore('PastTaskPlans', {
  load: (courseId) ->
    @_asyncStatus[courseId] = STATES.LOADING

  loaded: (data, courseId) ->
    @_asyncStatus[courseId] = STATES.LOADED
    @_local[courseId] = data.items
    @emitChange()
})

module.exports = StoreDefinition
