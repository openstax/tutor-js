# coffeelint: disable=no_empty_functions
flux = require 'flux-react'
_ = require 'underscore'

{CrudConfig, extendConfig, makeSimpleStore} = require './helpers'

TocConfig =
  _sections: {}
  _ecosystems: {}

  FAILED: -> console.error('BUG: could not load readings')

  _reset: ->
    @_sections = {}

  _loaded: (obj, id) ->
    chapters = obj[0].children
    map = @_ecosystems[id] = {
      all: []
      uuid: {}
    }

    # Load all the section id's for easy lookup later.
    # They are globally unique so we do not have to worry about the ecosystemId.
    for chap in chapters
      for section in chap.children
        map.all.push map.uuid[section.uuid] = section
        @_sections[section.id] = section
    chapters

  exports:
    findWhere: (ecosystemId, query) ->
      _.findWhere(@_ecosystems[ecosystemId]?.all, query)

    getByUuid: (ecosystemId, uuid) ->
      @_ecosystems[ecosystemId]?.uuid[uuid]

    findChapterSection: (ecosystemId, chapter_section) ->
      _.find(@_ecosystems[ecosystemId]?.all, (section) ->
        section.chapter_section.join('.') is chapter_section
      )

    getSectionInfo: (sectionId) ->
      @_sections[sectionId] or throw new Error("BUG: Invalid section id #{sectionId}")


extendConfig(TocConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TocConfig)
module.exports = {TocActions:actions, TocStore:store}
