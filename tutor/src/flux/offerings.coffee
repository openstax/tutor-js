{makeStandardStore} = require './helpers'
cloneDeep = require 'lodash/cloneDeep'
filter = require 'lodash/filter'

CourseInformation = require './course-information'

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
      CourseInformation[ @_get(id).appearance_code ].title

})

module.exports = StoreDefinition
