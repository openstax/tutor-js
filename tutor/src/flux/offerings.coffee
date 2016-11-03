{makeStandardStore} = require './helpers'
cloneDeep = require 'lodash/cloneDeep'
filter = require 'lodash/filter'

CourseAppearanceCodes = require './course-appearance-codes'

StoreDefinition = makeStandardStore('Offerings', {
  _local: {}
  _all:  []

  _loaded: (data) ->

    @_all = data.items
    for offering in @_all
      @_local[offering.id] = offering
    false

  exports:
    filter: (conditions) ->
      filter(@_all, conditions)

    getTitle: (id) ->
      CourseAppearanceCodes[ @_get(id).appearance_code ]

})

module.exports = StoreDefinition
