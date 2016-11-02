{makeStandardStore} = require './helpers'
cloneDeep = require 'lodash/cloneDeep'

BLANK = {}

StoreDefinition = makeStandardStore('PastTaskPlans', {
  _local: cloneDeep(BLANK)

  # used by api
  # coffeelint: disable=no_empty_functions
  load: ({courseId}) ->
  # coffeelint: enable=no_empty_functions
  loaded: ({courseId}, data) ->
    @_local[courseId] = data.items

  exports:
    get: (courseId) ->
      @_get(courseId)


})

module.exports = StoreDefinition
