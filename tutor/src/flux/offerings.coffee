{makeStandardStore} = require './helpers'
cloneDeep = require 'lodash/cloneDeep'

BLANK = []

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
    all: ->
      @_all

    getTitle: (id) ->
      CourseAppearanceCodes[ @_get(id).appearance_code ]

})

module.exports = StoreDefinition
