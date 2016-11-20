{makeStandardStore} = require './helpers'
isEmpty = require 'lodash/isEmpty'

StoreDefinition = makeStandardStore('PastTaskPlans', {
  _loaded: (data, courseId) ->
    data.items

  exports:
    hasPlans: (courseId) ->
      not isEmpty(@_get(courseId))
})

module.exports = StoreDefinition
