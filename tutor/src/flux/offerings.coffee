{makeStandardStore} = require './helpers'
cloneDeep = require 'lodash/cloneDeep'
filter = require 'lodash/filter'
includes = require 'lodash/includes'

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
      offering = @_get(id)
      offering.title or CourseInformation.forAppearanceCode(offering.appearance_code).title

    getDescription: (id) ->
      @_get(id).description

    getValidTerms: (id) ->
      offering = @_get(id)
      if offering.is_concept_coach
        filter(offering.active_term_years, (t) -> t.year is 2017 and includes(['spring', 'summer'], t.term))
      else
        offering.active_term_years
})

module.exports = StoreDefinition
